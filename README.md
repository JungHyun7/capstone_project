# 🚂 실시간 철도 시설물 이상 감지 및 관리 시스템
> **AI 기반 객체 탐지(YOLOv11)를 활용한 예방 중심 철도 안전 유지보수 솔루션**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)](https://github.com/ultralytics/ultralytics)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 📌 1. Project Motivation
철도 운행 중 시설물 결함(파손, 이탈 등)으로 인한 탈선 사고는 막대한 인명 및 재산 피해를 야기합니다. 본 프로젝트는 기존 인력 중심 점검의 한계를 극복하고, 최신 인공지능 기술을 통해 사고를 사전에 감지하여 예방하는 **지능형 유지보수 솔루션**을 구현하는 데 목적이 있습니다.

## 💡 2. Engineering Insight: Strategic Pivot (문제 해결 과정)
데이터 분석을 통해 프로젝트의 방향을 실용적으로 전환하여 엔지니어링 역량을 증명한 핵심 사례입니다.

* **초기 기획 및 문제 식별**: 최초 'AI 기반 철도 사고 발생 예측 모델'을 기획했으나, 공공데이터 분석 결과 주요 변수(강우량, 가시거리 등)의 **결측치가 90% 이상**임을 확인하여 모델 구축의 한계를 파악했습니다.
* **전략적 전환**: 사후 보고용 데이터의 한계를 인정하고, 실시간 점검에 즉시 투입 가능한 **'이미지 기반 실시간 이상 감지 시스템'**으로 프로젝트 주제를 재설정했습니다.
* **데이터 확보**: AI HUB의 **도시철도 선로 시설물 영상 데이터(61,622장, 21.79GB)**를 새롭게 확보하여 93%의 높은 정밀도를 가진 모델을 구축했습니다.

## 📂 3. Directory Structure
저장소의 주요 파일 구조와 역할은 다음과 같습니다.

```text
.
├── app.py              # Flask 서버 메인 (SocketIO 통신 및 라우팅)
├── database.py         # SQLite DB 관리 (감지 이력 CRUD 로직)
├── detect.py           # YOLOv11 추론 엔진 (Best.pt 모델 로드 및 분석)
├── best.pt             # 학습이 완료된 YOLOv11 모델 가중치 파일
├── yolo_class_info.json # 탐지 대상 11종 시설물 정보 명세
├── requirements.txt    # 프로젝트 실행을 위한 의존성 패키지 목록
├── railway_anomalies.db # 감지 데이터가 저장되는 SQLite 데이터베이스
├── static/
│   ├── js/
│   │   ├── dashboard.js  # 실시간 차트 시각화 및 데이터 처리
│   │   ├── camera.js     # 브라우저 웹캠 제어 및 프레임 전송
│   │   └── camera_backup.js # 카메라 제어 로직 백업 파일
│   └── css/
│       └── style.css     # 시스템 전체 UI 디자인 (다크 모드)
└── templates/
    └── index.html        # 메인 모니터링 및 실시간 탐지 페이지

## ✨ 4. Key Features

* **Real-time Video Inference**: Flask-SocketIO를 활용하여 초당 약 **30 FPS**의 저지연(Low-latency) 분석 환경을 구현했습니다.
* **Intelligent Anomaly Detection**: YOLOv11 모델이 시설물 결함을 탐지하며, 이상 발견 시 즉시 화면에 빨간색 바운딩 박스를 표시합니다.
* **Automated Incident Logging**: 이상 탐지 시 시간, 부품명, 신뢰도, 이미지 데이터를 **SQLite DB**에 자동 저장하여 이력 관리를 자동화합니다.
* **Interactive Dashboard**: **Chart.js**를 활용하여 부품별 결함 빈도 및 시간대별 발생 추이를 대시보드로 시각화합니다.
* **Cross-Platform Support**: 반응형 웹 설계로 PC뿐만 아니라 모바일 기기에서도 실시간 점검이 가능합니다.

## 🔍 5. Detection Classes (11 Classes)
시스템은 다음 11가지 핵심 시설물을 정밀 탐지하며 각 부품의 정상/이상 유무를 판별합니다.

| ID | 부품명 (ENG) | 한글명 | 탐지 내용 |
| :-- | :--- | :--- | :--- |
| 1 | rail | 레일 | 레일 표면 파손 및 균열 |
| 2 | lubricator | 도유기 | 윤활 장치 설치 상태 |
| 3 | weld_zone | 용접부 | 레일 연결 부위 파손 |
| 4 | fishplate | 분기부 이음매판 | 분기점 연결판 고정 상태 |
| 5 | bolt-nut | 볼트-너트 | 부품 체결 및 누락 여부 |
| 6 | pandrol_e-clip | 팬드롤 e-clip | 레일 고정 클립 이탈 |
| 7 | insulation-block| 절연블록 | 전기 절연체 파손 |
| 8 | screw_spike | 나사스파이크 | 레일 고정 나사 고정 상태 |
| 9 | guardrail bolt | 가드레일 볼트 | 가드레일 체결 상태 |
| 10 | hex_bolt | 육각볼트 | 구조물 고정 상태 |
| 11 | tie | 침목 | 침목 균열 및 노후도 |

## 🛠 6. Technical Stack
* **AI Model**: Ultralytics YOLOv11
* **Framework**: Python, Flask, Flask-SocketIO
* **Database**: SQLite3
* **Frontend**: JavaScript (Chart.js, Socket.io), HTML5, CSS3

## 📊 7. Model Performance
학습 결과, 산업 현장 적용이 가능한 수준의 높은 성능을 기록했습니다.
* **정확도 (mAP@50)**: **93.0%**
* **재현율 (Recall)**: **90.0%**
* **처리 속도**: **30 FPS** (목표치 24 FPS 초과 달성)

## 📂 8. System Architecture

![System Architecture](./시스템%20구성도.drawio.png)
1. **Client**: 카메라 피드 및 이미지 업로드를 통한 데이터 입력.
2. **Server**: SocketIO를 통한 실시간 통신 및 YOLOv11 추론 수행.
3. **Database**: 이상 탐지 이력 및 이미지 데이터 영구 저장.

## ⚠️ 9. Troubleshooting (기술적 한계 극복)
* **하드웨어 자원 제한**: 21.79GB의 대용량 데이터 학습 시 GPU 메모리 부족 문제 발생.
  - **해결**: 배치 크기(Batch Size) 최적화 및 데이터 분할 처리 기법을 적용하여 학습 안정화 성공.
* **현실적 제약 극복**: 초기 기획한 소형 이동체 도입이 예산 문제로 어려워짐.
  - **해결**: 접근성이 뛰어난 모바일 기기 기반의 시스템으로 유연하게 전환하여 실무 활용성을 극대화했습니다.

## 🔮 10. Future Roadmap
* **위치 기반 서비스**: GPS 연동을 통한 실시간 결함 발생 위치 지도 표시 기능 및 장치 위치 디스플레이 보완.
* **모델 범용성 확장**: 고속철도 및 다양한 기후 환경 데이터 추가 학습을 통한 모델 고도화.
* **원격 협업 시스템**: 실시간 현장 영상을 활용한 관리자-현장 인원 간의 원격 지원 시스템 연동.

## 🚀 11. Getting Started

### 1. 환경 설정 (.env)

FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db


## ✨ 4. Key Features

* **Real-time Video Inference**: Flask-SocketIO를 활용하여 초당 약 **30 FPS**의 저지연(Low-latency) 분석 환경을 구현했습니다.
* **Intelligent Anomaly Detection**: YOLOv11 모델이 시설물 결함을 탐지하며, 이상 발견 시 즉시 화면에 빨간색 바운딩 박스를 표시합니다.
* **Automated Incident Logging**: 이상 탐지 시 시간, 부품명, 신뢰도, 이미지 데이터를 **SQLite DB**에 자동 저장하여 이력 관리를 자동화합니다.
* **Interactive Dashboard**: **Chart.js**를 활용하여 부품별 결함 빈도 및 시간대별 발생 추이를 대시보드로 시각화합니다.
* **Cross-Platform Support**: 반응형 웹 설계로 PC뿐만 아니라 모바일 기기에서도 실시간 점검이 가능합니다.

## 🔍 5. Detection Classes (11 Classes)
시스템은 다음 11가지 핵심 시설물을 정밀 탐지하며 각 부품의 정상/이상 유무를 판별합니다.

| ID | 부품명 (ENG) | 한글명 | 탐지 내용 |
| :-- | :--- | :--- | :--- |
| 1 | rail | 레일 | 레일 표면 파손 및 균열 |
| 2 | lubricator | 도유기 | 윤활 장치 설치 상태 |
| 3 | weld_zone | 용접부 | 레일 연결 부위 파손 |
| 4 | fishplate | 분기부 이음매판 | 분기점 연결판 고정 상태 |
| 5 | bolt-nut | 볼트-너트 | 부품 체결 및 누락 여부 |
| 6 | pandrol_e-clip | 팬드롤 e-clip | 레일 고정 클립 이탈 |
| 7 | insulation-block| 절연블록 | 전기 절연체 파손 |
| 8 | screw_spike | 나사스파이크 | 레일 고정 나사 고정 상태 |
| 9 | guardrail bolt | 가드레일 볼트 | 가드레일 체결 상태 |
| 10 | hex_bolt | 육각볼트 | 구조물 고정 상태 |
| 11 | tie | 침목 | 침목 균열 및 노후도 |

## 🛠 6. Technical Stack
* **AI Model**: Ultralytics YOLOv11
* **Framework**: Python, Flask, Flask-SocketIO
* **Database**: SQLite3
* **Frontend**: JavaScript (Chart.js, Socket.io), HTML5, CSS3

## 📊 7. Model Performance
학습 결과, 산업 현장 적용이 가능한 수준의 높은 성능을 기록했습니다.
* **정확도 (mAP@50)**: **93.0%**
* **재현율 (Recall)**: **90.0%**
* **처리 속도**: **30 FPS** (목표치 24 FPS 초과 달성)

## 📂 8. System Architecture

![System Architecture](./시스템%20구성도.drawio.png)
1. **Client**: 카메라 피드 및 이미지 업로드를 통한 데이터 입력.
2. **Server**: SocketIO를 통한 실시간 통신 및 YOLOv11 추론 수행.
3. **Database**: 이상 탐지 이력 및 이미지 데이터 영구 저장.

## ⚠️ 9. Troubleshooting (기술적 한계 극복)
* **하드웨어 자원 제한**: 21.79GB의 대용량 데이터 학습 시 GPU 메모리 부족 문제 발생.
  - **해결**: 배치 크기(Batch Size) 최적화 및 데이터 분할 처리 기법을 적용하여 학습 안정화 성공.
* **현실적 제약 극복**: 초기 기획한 소형 이동체 도입이 예산 문제로 어려워짐.
  - **해결**: 접근성이 뛰어난 모바일 기기 기반의 시스템으로 유연하게 전환하여 실무 활용성을 극대화했습니다.

## 🔮 10. Future Roadmap
* **위치 기반 서비스**: GPS 연동을 통한 실시간 결함 발생 위치 지도 표시 기능 및 장치 위치 디스플레이 보완.
* **모델 범용성 확장**: 고속철도 및 다양한 기후 환경 데이터 추가 학습을 통한 모델 고도화.
* **원격 협업 시스템**: 실시간 현장 영상을 활용한 관리자-현장 인원 간의 원격 지원 시스템 연동.

## 🚀 11. Getting Started

### 1. 환경 설정 (.env)
```bash
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db

### 2. 설치 및 실행
```bash
# 의존성 패키지 설치
pip install -r requirements.txt

# 서버 실행
python app.py