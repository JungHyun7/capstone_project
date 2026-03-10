# 🚂 실시간 철도 이상 감지 및 시설물 관리 시스템 
> **AI 기반 객체 탐지(YOLOv11)를 활용한 예방 중심 철도 안전 관리 솔루션**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)](https://github.com/ultralytics/ultralytics)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 📌 Project Overview
[cite_start]최근 증가하는 철도 안전사고를 예방하기 위해 [cite: 4, 9][cite_start], YOLOv11 기반의 객체 탐지 기술을 활용하여 레일, 침목, 용접부 등 주요 철도 구조물의 이상 상태를 실시간으로 판별하는 시스템입니다. [cite: 5, 40] [cite_start]현장에서 즉각적인 대응이 가능하도록 웹 기반 인터페이스와 실시간 알림 시스템을 구축하였으며 [cite: 6, 22, 59][cite_start], 감지된 정보는 유지보수 이력 관리를 위해 내부 데이터베이스에 자동 저장됩니다. [cite: 7, 41, 55]

## 💡 Engineering Insight: Strategic Pivot (문제 해결 과정)
[cite_start]데이터 분석을 통해 프로젝트의 방향을 실용적으로 전환하여 엔지니어링 역량을 증명한 사례입니다. [cite: 14, 18, 35]

* [cite_start]**초기 기획 및 문제 식별**: 최초 'AI 기반 철도 사고 예측 모델'을 기획했으나 [cite: 9][cite_start], 공공데이터 분석 결과 강우량(97.3%), 가시거리(99.97%) 등 핵심 변수의 **결측치가 비정상적으로 높아(90% 이상)** 모델 구축이 불가능함을 확인했습니다. [cite: 11, 12, 33]
* [cite_start]**전략적 전환**: 사후 보고용 데이터의 한계를 인정하고 [cite: 13, 19][cite_start], 실선 점검에 즉시 투입 가능한 **'이미지 기반 실시간 이상 감지 시스템'**으로 프로젝트 주제를 재구성했습니다. [cite: 20, 21, 35]
* [cite_start]**데이터 확보 및 학습**: AI HUB의 **도시철도 선로 시설물 영상 데이터(61,622장, 21.79GB)**를 새롭게 확보하여 모델의 정밀도를 확보했습니다. [cite: 14, 15, 33]

## 📊 Dataset Information
[cite_start]모델 학습 및 검증을 위해 **AI Hub**에서 제공하는 정식 데이터를 활용하였습니다. [cite: 14, 304, 305]
* [cite_start]**데이터셋 명칭**: [철도 선로 상태 인식 데이터](https://www.aihub.or.kr/aihubdata/data/view.do?dataSetSn=71391) [cite: 304]
* [cite_start]**데이터 구성**: 61,622개의 고품질 이미지 및 JSON 라벨링 데이터 [cite: 15, 33, 318]
* [cite_start]**라벨링 특징**: 객체의 위치를 Polygon(다각형) 좌표로 정밀하게 라벨링하였으며 [cite: 16][cite_start], 날씨와 조도 등 환경 정보가 포함되어 있습니다. [cite: 17]

## ✨ Key Features
* [cite_start]**Real-time Video Inference**: Flask-SocketIO를 활용하여 초당 **30 FPS**의 저지연(Low-latency) 분석 환경을 구현했습니다. [cite: 34, 50, 58]
* [cite_start]**Intelligent Analysis**: YOLOv11 모델이 시설물 결함을 탐지하며 [cite: 40, 80, 327][cite_start], 클래스명이 `_abnormal`인 경우 빨간색 바운딩 박스를 표시합니다. [cite: 40, 43, 59]
* [cite_start]**Automated Incident Logging**: 이상 탐지 시 시간, 부품명, 신뢰도, 이미지 데이터를 **SQLite DB**에 자동 저장합니다. [cite: 41, 52, 56]
* [cite_start]**Interactive Dashboard**: **Chart.js**를 사용하여 구조물별 이상 감지 횟수 및 시간대별 추이를 시각화합니다. [cite: 43, 44, 77]
* [cite_start]**Mobile Ready**: 반응형 웹 설계로 PC뿐만 아니라 모바일 기기에서도 실시간 모니터링이 가능합니다. [cite: 38, 65, 79, 83]

## 🔍 Detection Classes (11 Classes)
[cite_start]시스템은 `yolo_class_info.json`에 정의된 다음 11가지 핵심 시설물을 정밀 탐지합니다. [cite: 33, 53, 54]

| ID | 부품명 (ENG) | 한글명 | 설명 |
| :-- | :--- | :--- | :--- |
| 1 | rail | 레일 | [cite_start]철도 궤도의 기본 구조물 [cite: 53] |
| 2 | lubricator | 도유기 | [cite_start]레일 윤활을 위한 장치 [cite: 53] |
| 3 | weld_zone | 용접부 | [cite_start]레일 연결 용접 부분 [cite: 54] |
| 4 | fishplate | 분기부 이음매판 | [cite_start]레일 분기점 연결판 [cite: 54] |
| 5 | bolt-nut | 볼트-너트 | [cite_start]구조물 체결용 볼트 [cite: 54] |
| 6 | pandrol_e-clip | 팬드롤 e-clip | [cite_start]레일 고정용 클립 [cite: 54] |
| 7 | insulation-block| 절연블록 | [cite_start]전기적 절연을 위한 블록 [cite: 54] |
| 8 | screw_spike | 나사스파이크 | [cite_start]레일 고정용 나사못 [cite: 54] |
| 9 | guardrail bolt | 가드레일 볼트 | [cite_start]가드레일 체결용 볼트 [cite: 54] |
| 10 | hex_bolt | 육각볼트 | [cite_start]구조물 고정용 육각 볼트 [cite: 54] |
| 11 | tie | 침목 | [cite_start]레일을 지지하는 횡목 [cite: 54] |

## 🛠 Tech Stack
* [cite_start]**AI Model**: Ultralytics YOLOv11 [cite: 23, 34, 80]
* [cite_start]**Framework**: Python, Flask, Flask-SocketIO [cite: 34, 50, 80]
* [cite_start]**Database**: SQLite3 [cite: 51, 52, 80]
* [cite_start]**Frontend**: HTML5, CSS3, JavaScript (Chart.js) [cite: 44, 80, 81]

## 📊 Model Performance
* [cite_start]**정확도 (mAP@50)**: **93.0%** 달성 (베이스라인 80% 대비 우수한 성과) [cite: 60, 62]
* [cite_start]**재현율 (Recall)**: **90.0%** 달성 [cite: 60, 62]
* [cite_start]**처리 속도**: **30 FPS** (목표치 24 FPS 초과 달성) [cite: 58, 60]

## 📂 System Architecture
![System Architecture](./시스템%20구성도.drawio.png)
* [cite_start]**Client**: 카메라 피드 및 이미지 업로드를 통한 데이터 입력 [cite: 37, 38, 71, 73]
* [cite_start]**Backend**: SocketIO를 통한 실시간 통신 및 YOLO 모델 추론 수행 [cite: 50, 51, 55]
* [cite_start]**Database**: 이상 감지 이력 영구 저장 및 통계 데이터 관리 [cite: 41, 52, 56]

## ⚠️ Troubleshooting (기술적 한계 극복)
* [cite_start]**하드웨어 자원 제한**: 대용량 데이터 학습 시 메모리 부족 문제 발생 → 배치 크기 최적화 및 데이터 분할 처리로 해결했습니다. [cite: 89, 90, 91]
* [cite_start]**현실적 제약 극복**: 예산 문제로 소형 이동체 도입이 어려워짐 → 접근성이 용이한 모바일 기기 기반의 시스템으로 유연하게 전환하여 실용성을 확보했습니다. [cite: 63, 64, 65]

## 🚀 Getting Started

### 1. 환경 설정 (.env)
[cite_start]프로젝트 루트에 `.env` 파일을 생성하고 보안을 위한 설정을 입력하세요. [cite: 1]
```text
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db