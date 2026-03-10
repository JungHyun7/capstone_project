# 🚂 실시간 철도 이상 감지 및 시설물 관리 시스템 
> **AI 기반 객체 탐지(YOLOv11)를 활용한 예방 중심 철도 안전 관리 솔루션**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)](https://github.com/ultralytics/ultralytics)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 📌 Project Overview
본 프로젝트는 인적 요인에 의한 철도 점검의 한계를 극복하고, 시설물 결함(파손, 이탈 등)을 실시간으로 감지하여 대형 사고를 예방하기 위해 개발되었습니다. **YOLOv11 모델**을 활용하여 레일, 침목, 체결구 등 11종의 핵심 시설물 상태를 분석하고, 이상 징후 발생 시 즉각적인 알림과 유지보수 이력 관리 기능을 제공합니다.

## 💡 Engineering Insight: Strategic Pivot (문제 해결 과정)
데이터 분석을 통해 프로젝트의 방향을 실무적으로 전환하여 기술적 가치를 확보한 과정입니다.

* **초기 기획 및 문제 식별**: 최초 'AI 기반 철도 사고 예측 모델'을 목표로 공공데이터(06-23년 사고 현황)를 분석했으나, 강우량(97.3%), 가시거리(99.1%) 등 **핵심 변수의 결측치가 90%를 상회**하여 모델 구축이 불가능함을 확인했습니다.
* **전략적 전환**: 사후 보고용 데이터의 한계를 인정하고, 실시간 점검에 즉시 투입 가능한 **'이미지 기반 이상 감지 시스템'**으로 프로젝트 주제를 재설정했습니다.
* **데이터 확보 및 학습**: AI HUB의 **도시철도 선로 시설물 영상 데이터(61,622장, 21.79GB)**를 새롭게 확보하여 93.0%의 정밀도를 확보했습니다.

## 📊 Dataset Information
모델 학습 및 검증을 위해 **AI Hub**에서 제공하는 정식 데이터를 활용하였습니다.
* **데이터셋 명칭**: [철도 선로 상태 인식 데이터](https://www.aihub.or.kr/aihubdata/data/view.do?dataSetSn=71391)
* **데이터 규모**: 61,622개의 고품질 이미지 및 JSON 라벨링 데이터
* **데이터 특징**: 객체의 위치를 Polygon(다각형) 좌표로 정밀하게 라벨링하였으며, 날씨와 조도 등 현장 환경 정보가 포함되어 있습니다.

## ✨ Key Features
* **Real-time Video Inference**: Flask-SocketIO 기반의 WebSocket 통신을 통해 클라이언트 영상을 초당 약 **30 FPS**로 저지연 분석합니다.
* **Intelligent Anomaly Detection**: YOLOv11 모델이 시설물 결함을 탐지하며, 이상 발견 시 즉시 화면에 빨간색 바운딩 박스를 표시합니다.
* **Automated Incident Logging**: 이상 탐지 시 시간, 부품명, 신뢰도, 좌표, 이미지 데이터를 **SQLite DB**에 자동 저장합니다.
* **Interactive Dashboard**: **Chart.js**를 활용하여 구조물별 결함 빈도 및 시간대별 발생 추이를 대시보드로 시각화합니다.
* **Mobile Ready**: 반응형 웹 설계로 PC뿐만 아니라 모바일 기기에서도 실시간 모니터링이 가능합니다.

## 🔍 Detection Classes (11 Classes)
시스템은 다음 11가지 핵심 시설물을 정밀 탐지하며 각 부품의 정상/이상 유무를 판별합니다.

| ID | 부품명 (ENG) | 한글명 | 설명 |
| :-- | :--- | :--- | :--- |
| 1 | rail | 레일 | 철도 궤도의 기본 구조물 |
| 2 | lubricator | 도유기 | 레일 윤활을 위한 장치 |
| 3 | weld_zone | 용접부 | 레일 연결 용접 부분 |
| 4 | fishplate | 분기부 이음매판 | 레일 분기점 연결판 |
| 5 | bolt-nut | 볼트-너트 | 구조물 체결용 볼트 |
| 6 | pandrol_e-clip | 팬드롤 e-clip | 레일 고정용 클립 |
| 7 | insulation-block| 절연블록 | 전기적 절연을 위한 블록 |
| 8 | screw_spike | 나사스파이크 | 레일 고정용 나사못 |
| 9 | guardrail bolt | 가드레일 볼트 | 가드레일 체결용 볼트 |
| 10 | hex_bolt | 육각볼트 | 구조물 고정용 육각 볼트 |
| 11 | tie | 침목 | 레일을 지지하는 횡목 |

## 🛠 Tech Stack
* **AI Model**: Ultralytics YOLOv11
* **Framework**: Python, Flask, Flask-SocketIO
* **Database**: SQLite3
* **Frontend**: HTML5, CSS3, JavaScript (Chart.js, Socket.io)

## 📊 Model Performance
* **정확도 (mAP@50)**: **93.0%** 달성 (목표 대비 우수한 정확도)
* **재현율 (Recall)**: **90.0%** 달성
* **처리 속도**: **30 FPS** (실시간 감지 기준 충족)

## 📂 System Architecture
![System Architecture](./시스템%20구성도.drawio.png)
* **Client**: 카메라 피드 제공 및 이미지 업로드 인터페이스
* **Backend**: SocketIO 실시간 통신 및 YOLOv11 모델 추론 수행
* **Database**: 이상 감지 이력 영구 저장 및 통계 데이터 관리

## ⚠️ Troubleshooting (기술적 한계 극복)
* **하드웨어 자원 제한**: 대용량 데이터 학습 시 메모리 부족 문제 발생 → 배치 크기 최적화 및 데이터 분할 처리로 해결했습니다.
* **현실적 제약 극복**: 초기 기획한 소형 이동체 도입이 어려워짐 → 접근성이 용이한 모바일 기기 기반의 시스템으로 유연하게 전환하여 실용성을 확보했습니다.

## 🚀 Getting Started

### 1. 환경 설정 (.env)
프로젝트 루트에 `.env` 파일을 생성하고 보안을 위한 설정을 입력하세요.
```text
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db