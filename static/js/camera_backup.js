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

    const ctx = canvas.getContext('2d');
    const resultCtx = resultCanvas.getContext('2d');

    let stream = null;
    let isStreaming = false;
    let interval = null;

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

        // 서버로 이미지 전송
        socket.emit('image', imageData);
    }

    // 이미지 업로드 처리
//    uploadForm.addEventListener('submit', function(e) {
//        e.preventDefault();
//
//        if (!fileInput.files.length) {
//            alert('파일을 선택해 주세요.');
//            return;
//        }
//
//        const formData = new FormData();
//        formData.append('image', fileInput.files[0]);
//
//        fetch('/upload', {
//            method: 'POST',
//            body: formData
//        })
//        .then(response => response.json())
//        .then(data => {
//            displayResult(data);
//        })
//        .catch(error => {
//            console.error('Error uploading image:', error);
//            alert('이미지 업로드 중 오류가 발생했습니다.');
//        });
//    });
    // 이미지 업로드 처리 *업데이트 햄버거
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processUploadedImage();
    });

    // 파일 입력 변경 시에도 자동으로 처리 (모바일에서 더 잘 작동)
    fileInput.addEventListener('change', function(e) {
        // 파일이 선택되면 자동으로 분석 시작
        if (fileInput.files.length > 0) {
            processUploadedImage();
        }
    });

    // 업로드된 이미지 처리 함수
    function processUploadedImage() {
        if (!fileInput.files.length) {
            alert('파일을 선택해 주세요.');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            // 이미지를 캔버스에 그려서 서버로 전송할 준비
            const img = new Image();
            img.onload = function() {
                // 캔버스 크기를 이미지에 맞게 조정
                canvas.width = img.width;
                canvas.height = img.height;
                resultCanvas.width = img.width;
                resultCanvas.height = img.height;

                // 이미지를 캔버스에 그리기
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // 캔버스의 이미지를 base64로 변환
                const imageData = canvas.toDataURL('image/jpeg', 0.8);

                // 서버로 이미지 전송
                socket.emit('image', imageData);

                console.log('이미지를 서버로 전송했습니다.');
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    // 탐지 결과 표시
//    function displayResult(data) {
//        // 결과 캔버스에 원본 이미지 그리기
//        const img = new Image();
//        img.onload = function() {
//            resultCanvas.width = img.width;
//            resultCanvas.height = img.height;
//            resultCtx.drawImage(img, 0, 0, img.width, img.height);
//
//            // 탐지 결과 표시
//            data.detections.forEach(det => {
//                const [x1, y1, x2, y2] = det.bbox;
//                const color = det.is_abnormal ? 'red' : 'green';
//
//                // 바운딩 박스 그리기
//                resultCtx.strokeStyle = color;
//                resultCtx.lineWidth = 2;
//                resultCtx.strokeRect(x1, y1, x2 - x1, y2 - y1);
//
//                // 클래스 이름 및 신뢰도 표시
//                resultCtx.fillStyle = color;
//                resultCtx.font = '16px Arial';
//                resultCtx.fillText(
//                    `${det.class_name_kor} (${(det.confidence * 100).toFixed(1)}%)`,
//                    x1, y1 > 20 ? y1 - 5 : y1 + 20
//                );
//            });
//
//            // 처리 시간 및 타임스탬프 업데이트
//            processTimeElement.textContent = data.process_time;
//            timestampElement.textContent = data.timestamp;
//
//            // 이상 목록 업데이트
//            updateAnomalyList(data.detections);
//        };
//
//        // JPEG 데이터에서 이미지 로드
//        img.src = canvas.toDataURL('image/jpeg');
//    }
    // 탐지 결과 표시 함수 수정 *업데이트
    function displayResult(data) {
        // 결과 캔버스에 원본 이미지 그리기
        const img = new Image();
        img.onload = function() {
            resultCanvas.width = img.width;
            resultCanvas.height = img.height;
            resultCtx.drawImage(img, 0, 0, img.width, img.height);

            // 탐지 결과 표시
            data.detections.forEach(det => {
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

            // 처리 시간 및 타임스탬프 업데이트
            processTimeElement.textContent = data.process_time;
            timestampElement.textContent = data.timestamp;

            // 이상 목록 업데이트
            updateAnomalyList(data.detections);
        };

        // 캔버스에 그려진 이미지 가져오기
        img.src = canvas.toDataURL('image/jpeg');
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
        displayResult(data);
    });

    // 초기화
    getCameras();
});