# 🚂 실시간 철도 이상 감지 및 시설물 관리 시스템 
> **AI 기반 객체 탐지(YOLOv11)를 활용한 예방 중심 철도 안전 관리 솔루션**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)](https://github.com/ultralytics/ultralytics)

## 📌 Project Overview
본 프로젝트는 철도 사고의 주요 원인인 시설물 결함을 실시간으로 감지하여 대형 사고를 예방하기 위해 개발되었습니다. 최신 **YOLOv11** 모델을 활용하여 선로 구성 요소의 상태를 분석하고, 이상 징후 발생 시 즉각적인 데이터 기록 및 통계 대시보드를 제공합니다.

## 💡 Engineering Insight: Strategic Pivot
데이터 분석을 통해 프로젝트의 방향을 실용적으로 전환하여 기술적 가치를 확보했습니다.

* **문제 식별**: 초기 '철도 사고 예측 모델' 기획 시 공공데이터의 핵심 변수(강우량 97.3%, 가시거리 99.1% 등) 결측치가 매우 높아 모델 구축이 불가능함을 확인했습니다.
* **해결책**: 데이터의 한계를 인정하고, 실선 점검에 즉시 투입 가능한 **'이미지 기반 실시간 이상 감지 시스템'**으로 목표를 재정의했습니다.
* **성과**: AI HUB의 고품질 데이터를 확보하여 **mAP 93%**라는 높은 정밀도를 달성했습니다.

## 📊 Dataset Information
모델 학습 및 검증을 위해 **AI Hub**에서 제공하는 정식 데이터를 활용하였습니다.
* **데이터셋 명칭**: [철도 선로 상태 인식 데이터](https://www.aihub.or.kr/aihubdata/data/view.do?pageIndex=1&currMenu=115&topMenu=100&srchOptnCnd=OPTNCND001&searchKeyword=%EC%B2%A0%EB%8F%84+%EC%84%A0%EB%A1%9C&srchDetailCnd=DETAILCND001&srchOrder=ORDER001&srchPagePer=20&aihubDataSe=data&dataSetSn=71391)
* **데이터 규모**: 총 61,622장의 영상 데이터 (약 21.79GB)
* **데이터 특징**: 레일, 침목, 체결구 등 철도 핵심 시설물의 정상 및 결함(파손, 이탈, 균열) 상태 포함

## 🔍 Detection Classes (JSON 기반)
시스템은 `yolo_class_info.json`에 정의된 다음 11가지 핵심 시설물을 정밀 탐지합니다.

| 부품명 (KOR) | 클래스명 (ENG) | 탐지 및 분석 내용 |
| :--- | :--- | :--- |
| **레일** | Rail | 레일 표면 파손 및 균열 감지 |
| **침목** | Tie | 침목의 균열 및 노후도 판별 |
| **체결장치** | Fastening | 체결구의 이탈 및 이완 상태 확인 |
| **볼트/너트** | Bolt/Nut | 부품 누락 및 체결 상태 탐지 |
| **용접부** | Weld zone | 용접 부위의 파손 여부 판별 |
| **기타 부품** | Insulation block 등 | 절연블록, 레일패드 등 11종 구성 요소 |

## 🛠 System Architecture
![System Architecture](./시스템%20구성도.drawio.png)
*이미지 파일명이 '시스템 구성도.drawio.png'인 경우 위와 같이 표시됩니다.*

1.  **Input**: 클라이언트 카메라 스트리밍 또는 이미지 파일 업로드
2.  **Inference**: WebSocket(SocketIO)을 통해 서버로 전송된 데이터를 YOLOv11로 분석
3.  **Storage**: 이상 탐지 시 이미지와 상세 정보를 SQLite DB에 자동 저장
4.  **Dashboard**: 저장된 데이터를 기반으로 실시간 통계 및 이력 시각화

## 🚀 Getting Started

### 1. 환경 설정 (.env)
```text
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db