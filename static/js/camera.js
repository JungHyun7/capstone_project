document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const resultCanvas = document.getElementById('resultCanvas');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const cameraSelect = document.getElementById('cameraSelect');
    const processTimeElement = document.getElementById('processTime');
    const timestampElement = document.getElementById('timestamp');
    const anomalyList = document.getElementById('anomalyList');
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');

    // 연결 상태 표시를 위한 요소 추가 (HTML에도 추가 필요)
    const connectionStatus = document.createElement('div');
    connectionStatus.id = 'connectionStatus';
    connectionStatus.className = 'status-indicator';
    connectionStatus.textContent = '연결 대기 중...';
    document.querySelector('.camera-controls').appendChild(connectionStatus);

    const ctx = canvas.getContext('2d');
    const resultCtx = resultCanvas.getContext('2d');

    let stream = null;
    let isStreaming = false;
    let interval = null;

    // 소켓 연결 상태 확인
    socket.on('connect', function() {
        console.log('서버에 연결되었습니다.');
        connectionStatus.textContent = '연결됨';
        connectionStatus.className = 'status-indicator connected';
    });

    socket.on('disconnect', function() {
        console.log('서버와 연결이 끊겼습니다.');
        connectionStatus.textContent = '연결 끊김';
        connectionStatus.className = 'status-indicator disconnected';
    });

    // 재연결 시도
    socket.on('reconnect', function(attemptNumber) {
        console.log(`재연결 성공 (${attemptNumber}번째 시도)`);
        connectionStatus.textContent = '재연결됨';
        connectionStatus.className = 'status-indicator connected';
    });

    // MediaDevices API 지원 여부 확인
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('이 브라우저는 카메라 접근을 지원하지 않습니다. 최신 Chrome, Firefox, Safari 또는 Edge 브라우저를 사용해 주세요.');
        startBtn.disabled = true;
    }

    // 사용 가능한 카메라 목록 가져오기
    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            cameraSelect.innerHTML = '<option value="">카메라 선택</option>';

            // 후면/전면 카메라 테스트 옵션 추가
            cameraSelect.innerHTML += `
                <option value="environment">후면 카메라 (기본)</option>
                <option value="user">전면 카메라</option>
            `;

            // 각 카메라 장치 추가
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `카메라 ${index + 1}`;
                cameraSelect.appendChild(option);
            });

            // 기본값으로 후면 카메라 선택
            cameraSelect.value = "environment";
        } catch (error) {
            console.error('Error getting cameras:', error);
            alert('카메라 목록을 가져올 수 없습니다: ' + error.message);
        }
    }

    // 카메라 시작
    async function startCamera() {
        try {
            let constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            // 카메라 선택에 따라 제약 조건 설정
            if (cameraSelect.value === "environment") {
                constraints.video.facingMode = { ideal: "environment" };
            } else if (cameraSelect.value === "user") {
                constraints.video.facingMode = { ideal: "user" };
            } else if (cameraSelect.value) {
                constraints.video.deviceId = { exact: cameraSelect.value };
            }

            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;

            video.onloadedmetadata = function() {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                resultCanvas.width = video.videoWidth;
                resultCanvas.height = video.videoHeight;
                isStreaming = true;

                startBtn.disabled = true;
                stopBtn.disabled = false;

                // 1초마다 이미지 전송
                interval = setInterval(captureAndSend, 1000);
            };
        } catch (error) {
            console.error('Error starting camera:', error);
            alert('카메라를 시작할 수 없습니다: ' + error.message);
        }
    }

    // 카메라 중지
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            isStreaming = false;

            startBtn.disabled = false;
            stopBtn.disabled = true;

            clearInterval(interval);
        }
    }

    // 이미지 캡처 및 전송
    function captureAndSend() {
        if (!isStreaming) return;

        // 현재 비디오 프레임을 캔버스에 그리기
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 캔버스의 이미지를 base64로 변환
        const imageData = canvas.toDataURL('image/jpeg', 0.8);

        console.log('실시간 이미지 전송 중...');

        // 서버로 이미지 전송
        socket.emit('image', imageData);
    }

    // 이미지 업로드 처리
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('폼 제출 이벤트 발생');
        processUploadedImage();
    });

    // 파일 입력 변경 시에도 자동으로 처리 (모바일에서 더 잘 작동)
    fileInput.addEventListener('change', function(e) {
        console.log('파일 입력 변경 이벤트 발생');
        // 파일이 선택되면 자동으로 분석 시작
        if (fileInput.files.length > 0) {
            processUploadedImage();
        }
    });

    // 업로드된 이미지 처리 함수
    function processUploadedImage() {
        console.log('이미지 처리 시작');
        if (!fileInput.files.length) {
            alert('파일을 선택해 주세요.');
            return;
        }

        const file = fileInput.files[0];
        console.log('선택된 파일:', file.name, file.type, file.size);

        const reader = new FileReader();

        reader.onload = function(e) {
            console.log('이미지 로드 완료', e.target.result.substring(0, 50) + '...');

            // 이미지를 캔버스에 그려서 서버로 전송할 준비
            const img = new Image();

            img.onload = function() {
                console.log('이미지 객체 로드 완료, 크기:', img.width, 'x', img.height);

                // 이미지 크기 제한 (필요시)
                const maxWidth = 1280;
                const maxHeight = 720;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = (maxHeight / height) * width;
                    height = maxHeight;
                }

                // 캔버스 크기 조정
                canvas.width = width;
                canvas.height = height;
                resultCanvas.width = width;
                resultCanvas.height = height;

                console.log('캔버스 크기 조정:', width, 'x', height);

                // 이미지 그리기 (크기 조정)
                ctx.drawImage(img, 0, 0, width, height);

                // 캔버스의 이미지를 base64로 변환
                const imageData = canvas.toDataURL('image/jpeg', 0.8);

                console.log('서버로 이미지 전송', imageData.substring(0, 50) + '...');

                // 서버로 이미지 전송
                socket.emit('image', imageData);
                console.log('이미지를 서버로 전송했습니다.');
            };

            // 에러 처리 추가
            img.onerror = function(error) {
                console.error('이미지 로드 중 오류 발생:', error);
                alert('이미지를 로드할 수 없습니다. 다른 이미지를 시도해보세요.');
            };

            img.src = e.target.result;
        };

        reader.onerror = function(error) {
            console.error('파일 읽기 오류:', error);
            alert('파일을 읽을 수 없습니다: ' + error);
        };

        reader.readAsDataURL(file);
    }

    // 탐지 결과 표시 함수
    function displayResult(data) {
        console.log('탐지 결과 수신:', data);

        if (!data || !data.detections) {
            console.error('유효하지 않은 탐지 결과:', data);
            alert('서버에서 유효한 결과를 받지 못했습니다.');
            return;
        }

        // 결과 캔버스에 원본 이미지 그리기
        const img = new Image();

        // 에러 처리 추가
        img.onerror = function(error) {
            console.error('결과 이미지 로드 중 오류 발생:', error);

            // 대체 방법: 원본 캔버스의 내용만 복사
            resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
            resultCtx.drawImage(canvas, 0, 0);

            // 바운딩 박스 그리기만 진행
            drawDetectionBoxes(data.detections);
        };

        img.onload = function() {
            console.log('결과 이미지 로드 완료');
            resultCanvas.width = canvas.width; // 원본 캔버스와 동일한 크기 사용
            resultCanvas.height = canvas.height;
            resultCtx.drawImage(img, 0, 0, resultCanvas.width, resultCanvas.height);

            // 바운딩 박스 그리기
            drawDetectionBoxes(data.detections);
        };

        // 최근 캔버스 이미지 사용
        img.src = canvas.toDataURL('image/jpeg');

        // 처리 시간 및 타임스탬프 업데이트
        processTimeElement.textContent = data.process_time;
        timestampElement.textContent = data.timestamp;

        // 이상 목록 업데이트
        updateAnomalyList(data.detections);
    }

    // 바운딩 박스 그리기 함수 분리
    function drawDetectionBoxes(detections) {
        detections.forEach(det => {
            const [x1, y1, x2, y2] = det.bbox;
            const color = det.is_abnormal ? 'red' : 'green';

            // 바운딩 박스 그리기
            resultCtx.strokeStyle = color;
            resultCtx.lineWidth = 2;
            resultCtx.strokeRect(x1, y1, x2 - x1, y2 - y1);

            // 클래스 이름 및 신뢰도 표시
            resultCtx.fillStyle = color;
            resultCtx.font = '16px Arial';
            resultCtx.fillText(
                `${det.class_name_kor} (${(det.confidence * 100).toFixed(1)}%)`,
                x1, y1 > 20 ? y1 - 5 : y1 + 20
            );
        });
    }

    // 이상 목록 업데이트
    function updateAnomalyList(detections) {
        // 이상 항목만 필터링
        const anomalies = detections.filter(det => det.is_abnormal);

        // 이상 목록 초기화
        anomalyList.innerHTML = '';

        if (anomalies.length === 0) {
            anomalyList.innerHTML = '<div class="no-anomaly">이상이 감지되지 않았습니다.</div>';
            return;
        }

        // 이상 항목 추가
        anomalies.forEach(anomaly => {
            const anomalyItem = document.createElement('div');
            anomalyItem.className = 'anomaly-item';
            anomalyItem.innerHTML = `
                <div><strong>구조물:</strong> ${anomaly.class_name_kor}</div>
                <div><strong>신뢰도:</strong> ${(anomaly.confidence * 100).toFixed(1)}%</div>
                <div><strong>위치:</strong> [${anomaly.bbox.join(', ')}]</div>
            `;
            anomalyList.appendChild(anomalyItem);
        });
    }

    // 이벤트 리스너
    startBtn.addEventListener('click', startCamera);
    stopBtn.addEventListener('click', stopCamera);
    cameraSelect.addEventListener('change', function() {
        if (isStreaming) {
            stopCamera();
            startCamera();
        }
    });

    // 소켓 이벤트 리스너
    socket.on('detection_result', function(data) {
        console.log('탐지 결과 이벤트 수신');
        displayResult(data);
    });

    // 초기화
    getCameras();

    // style.css에 추가할 스타일
    const style = document.createElement('style');
    style.textContent = `
        .status-indicator {
            margin-left: 10px;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
        }

        .connected {
            background-color: #2ecc71;
            color: white;
        }

        .disconnected {
            background-color: #e74c3c;
            color: white;
        }
    `;
    document.head.appendChild(style);
});