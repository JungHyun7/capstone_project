document.addEventListener('DOMContentLoaded', function() {
    const componentChart = document.getElementById('componentChart').getContext('2d');
    const timeChart = document.getElementById('timeChart').getContext('2d');
    const historyList = document.getElementById('historyList');

    // 차트 객체
    let componentChartObj = null;
    let timeChartObj = null;

    // 소켓 이벤트 (detection_result)
    socket.on('detection_result', function(data) {
        updateDashboard(data);
    });

    // 이상 감지 기록 가져오기 (초기 로드)
    fetchAnomalyHistory();

    // 대시보드 업데이트
    function updateDashboard(data) {
        // 이상 감지가 있을 경우 즉시 갱신
        const anomalies = data.detections.filter(det => det.is_abnormal);
        if (anomalies.length > 0) {
            // 즉시 차트 업데이트를 위한 임시 데이터 추가
            updateAnomalyCharts(anomalies, data.timestamp);
            // 전체 데이터 갱신
            fetchAnomalyHistory();
        }
    }

    // 새 이상 항목으로 차트 즉시 업데이트
    function updateAnomalyCharts(anomalies, timestamp) {
        // 최근 감지 목록에 새 항목 추가
        anomalies.forEach(anomaly => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div><strong>시간:</strong> ${timestamp}</div>
                <div><strong>구조물:</strong> ${anomaly.class_name_kor}</div>
                <div><strong>신뢰도:</strong> ${(anomaly.confidence * 100).toFixed(1)}%</div>
            `;

            // 가장 위에 추가
            if (historyList.firstChild) {
                historyList.insertBefore(historyItem, historyList.firstChild);
            } else {
                historyList.appendChild(historyItem);
            }

            // 최대 10개만 유지
            if (historyList.children.length > 10) {
                historyList.removeChild(historyList.lastChild);
            }
        });

        // 컴포넌트 차트도 업데이트 (간단히 카운트 증가)
        if (componentChartObj) {
            anomalies.forEach(anomaly => {
                const componentName = anomaly.class_name_kor;
                const index = componentChartObj.data.labels.indexOf(componentName);

                if (index >= 0) {
                    // 기존 컴포넌트면 카운트 증가
                    componentChartObj.data.datasets[0].data[index]++;
                } else {
                    // 새 컴포넌트면 추가
                    componentChartObj.data.labels.push(componentName);
                    componentChartObj.data.datasets[0].data.push(1);
                }
            });

            componentChartObj.update();
        }
    }

    // 이상 감지 기록 가져오기
    function fetchAnomalyHistory() {
        fetch('/history?days=7')
            .then(response => response.json())
            .then(data => {
                updateHistoryList(data);
                updateComponentChart(data);
                updateTimeChart(data);
            })
            .catch(error => console.error('Error fetching history:', error));
    }

    // 이상 감지 기록 목록 업데이트
    function updateHistoryList(data) {
        historyList.innerHTML = '';

        if (data.length === 0) {
            historyList.innerHTML = '<div class="no-history">최근 이상 감지 기록이 없습니다.</div>';
            return;
        }

        // 최근 10개만 표시
        const recentData = data.slice(0, 10);

        recentData.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div><strong>시간:</strong> ${item.timestamp}</div>
                <div><strong>구조물:</strong> ${item.component_kor}</div>
                <div><strong>신뢰도:</strong> ${(item.confidence * 100).toFixed(1)}%</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    // 구조물별 이상 감지 차트 업데이트
    function updateComponentChart(data) {
        // 구조물별 이상 감지 횟수 계산
        const componentCounts = {};

        data.forEach(item => {
            const component = item.component_kor;
            componentCounts[component] = (componentCounts[component] || 0) + 1;
        });

        const labels = Object.keys(componentCounts);
        const counts = Object.values(componentCounts);

        // 차트 생성 또는 업데이트
        if (componentChartObj) {
            componentChartObj.data.labels = labels;
            componentChartObj.data.datasets[0].data = counts;
            componentChartObj.update();
        } else {
            componentChartObj = new Chart(componentChart, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '이상 감지 횟수',
                        data: counts,
                        backgroundColor: 'rgba(231, 76, 60, 0.7)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    // 시간대별 이상 감지 차트 업데이트
    function updateTimeChart(data) {
        // 날짜별로 그룹화
        const dateGroups = {};

        data.forEach(item => {
            const date = item.timestamp.split(' ')[0]; // YYYY-MM-DD 부분만 추출
            dateGroups[date] = (dateGroups[date] || 0) + 1;
        });

        // 최근 7일 데이터 준비 (빈 날짜 포함)
        const dates = [];
        const counts = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식

            dates.push(dateStr);
            counts.push(dateGroups[dateStr] || 0);
        }

        // 차트 생성 또는 업데이트
        if (timeChartObj) {
            timeChartObj.data.labels = dates;
            timeChartObj.data.datasets[0].data = counts;
            timeChartObj.update();
        } else {
            timeChartObj = new Chart(timeChart, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: '일일 이상 감지 건수',
                        data: counts,
                        backgroundColor: 'rgba(52, 152, 219, 0.5)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    }

    // 1분마다 데이터 자동 갱신
    setInterval(fetchAnomalyHistory, 60000);
});