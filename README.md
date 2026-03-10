# 🚂 실시간 철도 이상 감지 및 시설물 관리 시스템 
> [cite_start]**AI 기반 객체 탐지(YOLOv11)를 활용한 예방 중심 철도 안전 관리 솔루션** [cite: 5, 21]

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)](https://github.com/ultralytics/ultralytics)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 📌 Project Overview
[cite_start]본 프로젝트는 철도 운행 중 발생할 수 있는 선로 및 구조물 손상으로 인한 사고를 사전에 예방하기 위해 개발되었습니다. [cite: 4] [cite_start]인적 요인에 의한 점검 한계를 극복하고자 **YOLOv11 기반 객체 탐지 기술**을 활용하여 레일, 침목, 용접부 등 주요 시설물의 이상 상태를 실시간으로 판별하고 관리자에게 즉각적인 데이터를 제공합니다. [cite: 5, 6, 301]

## 💡 Engineering Insight: Strategic Pivot (문제 해결 과정)
[cite_start]데이터 분석을 통해 프로젝트의 방향을 실용적으로 전환하여 기술적 가치를 확보한 과정입니다. [cite: 35, 36]

* [cite_start]**초기 기획 및 문제 식별**: 최초 '철도 사고 예측 모델'을 목표로 2006-2023 철도 사고 데이터를 분석했으나, 강우량(97.3%), 적설량(97.9%), 가시거리(99.9%) 등 핵심 변수의 **결측치가 90%를 상회**하여 모델 구축이 불가능함을 확인했습니다. [cite: 9, 11, 12, 13]
* [cite_start]**전략적 전환**: 사후 보고용 데이터의 한계를 인정하고, 실선 점검에 즉시 투입 가능한 **'이미지 기반 실시간 이상 감지 시스템'**으로 목표를 재정의했습니다. [cite: 14, 19, 20]
* [cite_start]**데이터 확보**: AI HUB의 고품질 영상 데이터셋으로 소스를 변경하여 모델의 실용성을 확보했습니다. [cite: 20, 33]

## 📊 Dataset Information
[cite_start]학습 및 검증을 위해 **AI Hub**에서 제공하는 정식 데이터를 활용하였습니다. [cite: 14, 304]
* [cite_start]**데이터셋 명칭**: [철도 선로 상태 인식 데이터](https://www.aihub.or.kr/aihubdata/data/view.do?dataSetSn=71391) [cite: 304]
* [cite_start]**데이터 규모**: 61,622개의 고품질 이미지 및 JSON 라벨링 데이터 (약 21.79GB) [cite: 15, 33, 314]
* [cite_start]**데이터 특징**: 날씨, 온도, 조도 등 다양한 환경 조건이 포함된 11가지 핵심 철도 시설물 데이터입니다. [cite: 17, 33]

## ✨ Key Features
* [cite_start]**Real-time Detection**: Flask-SocketIO를 활용해 클라이언트 영상을 초당 약 **30 FPS**로 저지연 분석합니다. [cite: 38, 55, 58]
* [cite_start]**Intelligent Analysis**: YOLOv11 모델이 시설물 결함을 탐지하며, 클래스명이 `_abnormal`인 경우 이상으로 판단하여 빨간색 바운딩 박스를 표시합니다. [cite: 40, 43]
* [cite_start]**Automatic Logging**: 이상 탐지 시 시간, 부품명, 신뢰도, 좌표, 이미지 데이터를 **SQLite DB**에 자동 저장합니다. [cite: 7, 41, 52]
* [cite_start]**Interactive Dashboard**: **Chart.js**를 사용하여 구조물별 이상 감지 횟수 및 시간대별 분포를 실시간으로 시각화합니다. [cite: 43, 44]
* [cite_start]**Responsive UI**: PC 및 모바일 환경을 모두 지원하여 현장 점검의 휴대성을 극대화했습니다. [cite: 22, 29, 79]

## 🔍 Detection Classes (11 Classes)
[cite_start]시스템은 다음 11가지 핵심 시설물을 정밀 탐지하며, 각 항목의 정상 및 이상 상태를 분류합니다. [cite: 33, 53]

| ID | 부품명 (ENG) | 한글명 | 설명 |
| :-- | :--- | :--- | :--- |
| 1 | rail | 레일 | [cite_start]철도 궤도의 기본 구조물 [cite: 53] |
| 2 | lubricator | 도유기 | [cite_start]레일 윤활 장치 [cite: 53] |
| 3 | weld_zone | 용접부 | [cite_start]레일 연결 용접 부분 [cite: 53, 54] |
| 4 | fishplate | 분기부 이음매판 | [cite_start]레일 분기점 연결판 [cite: 53] |
| 5 | bolt-nut | 볼트-너트 | [cite_start]구조물 체결용 부품 [cite: 53] |
| 6 | pandrol_e-clip | 팬드롤 e-clip | [cite_start]레일 고정용 클립 [cite: 53] |
| 7 | insulation-block| 절연블록 | [cite_start]전기적 절연을 위한 블록 [cite: 53] |
| 8 | screw_spike | 나사스파이크 | [cite_start]레일 고정용 나사못 [cite: 53] |
| 9 | guardrail bolt | 가드레일 볼트 | [cite_start]가드레일 체결용 부품 [cite: 53] |
| 10 | hex_bolt | 육각볼트 | [cite_start]구조물 고정용 볼트 [cite: 53] |
| 11 | tie | 침목 | [cite_start]레일을 지지하는 횡목 [cite: 53, 54] |



## 🛠 Tech Stack
* [cite_start]**AI Model**: YOLOv11 [cite: 5, 23, 80]
* [cite_start]**Backend**: Python, Flask, Flask-SocketIO, SQLite3 [cite: 51, 80]
* [cite_start]**Frontend**: HTML5, CSS3, JavaScript (Chart.js) [cite: 80]
* [cite_start]**Environment**: Google Colab Pro (Training), VS Code [cite: 90]

## 📊 Model Performance
* [cite_start]**mAP@50**: **93.0%** 달성 [cite: 60, 62]
* [cite_start]**Recall (재현율)**: **90.0%** 달성 [cite: 60, 62]
* [cite_start]**Inference Speed**: 약 **30 FPS** (실시간 감지 기준 24 FPS 초과 달성) [cite: 58, 62]

## 📂 System Architecture
[cite_start]![System Architecture](./시스템%20구성도.drawio.png) [cite: 49]
* [cite_start]**Client**: 카메라 피드 또는 이미지 업로드 [cite: 37, 38]
* [cite_start]**Server (Flask)**: SocketIO를 통한 실시간 통신 및 YOLO 모델 추론 [cite: 50, 51]
* [cite_start]**Database**: 이상 감지 이력 및 이미지 데이터 저장 [cite: 51, 52]



## ⚠️ Troubleshooting
* [cite_start]**하드웨어 제약**: 대용량 데이터 학습 시 GPU 메모리 부족 문제 발생 → 배치 크기 조정 및 데이터 분할 처리로 해결했습니다. [cite: 89, 90, 91]
* [cite_start]**설계 변경**: 초기 기획한 소형 이동체 도입이 예산 문제로 어려워짐 → 모바일 기기 기반 시스템으로 유연하게 전환하여 실용성을 확보했습니다. [cite: 63, 64, 65]

## 🚀 Getting Started

### 1. 환경 설정 (.env)
프로젝트 루트에 `.env` 파일을 생성하고 보안을 위한 설정을 입력하세요.
```text
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db