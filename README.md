# 🚂 실시간 철도 시설물 이상 감지 시스템 (Railway Anomaly Detection)
> **YOLOv11 기반의 실시간 객체 탐지 기술을 활용한 예방 중심 안전 관리 솔루션**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)](https://github.com/ultralytics/ultralytics)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## 📌 Project Overview
본 프로젝트는 인적 요인에 의한 철도 사고 예방의 한계를 극복하고, 시설물 결함으로 인한 사고를 실시간으로 감지하기 위해 개발되었습니다. 인공지능(YOLOv11)을 활용하여 선로 구성 요소의 정상/이상 상태를 즉각 판별하고, 현장 점검 인원에게 실시간 데이터 대시보드를 제공함으로써 유지보수 효율성을 극대화합니다.

## 💡 Engineering Insight: Strategic Pivot
데이터의 품질 문제를 기술적 통찰력으로 해결하여 프로젝트의 방향을 실용적으로 전환했습니다.

* **문제 식별**: 초기에는 공공데이터(06-23년 철도사고 현황)를 활용한 '사고 예측 모델'을 기획했으나, 분석 결과 강우량(97.3%), 적설량(99.6%) 등 핵심 변수의 **결측치가 90%를 상회**하여 모델 구축이 불가능함을 확인했습니다.
* **전략적 전환**: 사후 보고용 데이터의 한계를 인정하고, 실선 점검에 즉시 투입 가능한 **'이미지 기반 실시간 이상 감지 시스템'**으로 목표를 재정의했습니다.
* **데이터 확보**: AI HUB의 **도시철도 선로 시설물 영상 데이터(61,622장, 21.79GB)**를 새롭게 확보하여 학습 모델의 정밀도를 확보했습니다.

## ✨ Key Features
* **Real-time Video Inference**: Flask-SocketIO 기반의 WebSocket 통신을 통해 클라이언트 영상을 초당 약 **30 FPS**로 실시간 분석합니다.
* **Intelligent Detection**: YOLOv11 모델이 11종의 핵심 시설물을 탐지하며, 결함(파손, 균열, 이탈) 발견 시 즉시 알림을 표시합니다.
* **Automated Logging**: 이상 감지 시 해당 시점의 이미지와 메타데이터(신뢰도, 좌표)를 **SQLite DB**에 자동 기록하여 유지보수 이력을 자동화합니다.
* **Interactive Dashboard**: **Chart.js**를 활용하여 부품별 결함 빈도 및 시간대별 발생 추이를 대시보드로 시각화합니다.
* **Mobile Ready**: 반응형 웹 설계로 PC뿐만 아니라 현장 점검 인원의 모바일 기기에서도 실시간 모니터링이 가능합니다.

## 🔍 Detection Targets (11 Classes)
AI 모델은 다음 시설물을 정밀 탐지하며, 각 부품의 '정상' 및 '기술적 결함' 상태를 판별합니다.
- **주요 항목**: 레일(Rail), 침목(Tie), 용접부(Weld), 체결장치(Fastening), 볼트/너트, 나사스파이크, 절연블록 등

## 🛠 Tech Stack
* **AI/ML**: Python, Ultralytics YOLOv11, OpenCV, PyTorch
* **Backend**: Flask, Flask-SocketIO, SQLite3
* **Frontend**: JavaScript (Chart.js, Socket.io), HTML5, CSS3
* **Environment**: Google Colab Pro (Training), VS Code (Dev)

## 📊 Model Performance
* **mAP@50**: **93.0%** (데이터셋 가이드라인 대비 우수한 정밀도 확보)
* **Recall (재현율)**: **90.0%** 달성
* **Processing Speed**: 약 **0.033s** (실시간 감지 기준 충족)

## 📂 System Architecture
시스템은 이미지 수집부터 분석, 저장, 시각화까지 유기적으로 연동됩니다.

1.  **Client**: 카메라 피드 또는 이미지 파일을 WebSocket을 통해 서버로 전송
2.  **Server**: YOLOv11 모델을 통한 실시간 객체 탐지 및 상태 추론
3.  **Database**: 이상 데이터 발생 시 관련 이미지와 정보를 SQLite에 영구 저장
4.  **Admin UI**: 탐지 결과가 포함된 실시간 피드와 통계 대시보드 출력

## 🚀 Getting Started

### 1. 환경 설정 (.env)
```text
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db
