# 🚂 실시간 철도 이상 감지 및 시설물 관리 시스템 
> **AI 기반의 실시간 객체 탐지(YOLOv11)를 활용한 예방 중심 철도 안전 관리 솔루션**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)](https://github.com/ultralytics/ultralytics)

## 📌 Project Overview
[cite_start]본 프로젝트는 철도 운행 중 발생할 수 있는 선로 및 구조물 손상으로 인한 탈선 사고를 사전에 예방하고자 개발되었습니다[cite: 6]. [cite_start]기존의 사후 보고용 데이터가 가진 한계를 극복하고, **YOLOv11 기반 객체 탐지 기술**을 활용하여 레일, 침목, 용접부 등 주요 구조물의 이상 상태를 실시간으로 판별합니다[cite: 7].

## 💡 Engineering Insight: Problem Solving (Pivot)
데이터 분석을 통해 프로젝트의 방향을 실용적으로 전환한 경험은 본 프로젝트의 핵심 역량입니다.

* [cite_start]**문제 식별**: 초기 기획했던 '철도 사고 예측 모델'은 공공데이터의 **결측치 비율이 90%를 상회(강우량 97%, 가시거리 99% 등)**하여 AI 학습에 부적합함을 확인했습니다[cite: 13, 14].
* [cite_start]**해결책**: 데이터 품질 문제를 해결하기 위해 **AI HUB의 고품질 영상 데이터셋(61,622장)**으로 소스를 변경하고, '사고 예측'에서 **'실시간 이상 감지'**로 목표를 재정의하여 기술적 완성도를 높였습니다[cite: 16, 21, 22].

## ✨ Key Features
* [cite_start]**Real-time Detection**: Flask-SocketIO를 활용하여 초당 **30 FPS**의 속도로 실시간 영상 분석 결과를 전송합니다[cite: 61, 62].
* [cite_start]**Intelligent Analysis**: YOLOv11 모델을 통해 레일, 침목, 체결구 등 11종의 시설물의 정상/결함 상태를 동시 판별합니다[cite: 42, 55, 56].
* [cite_start]**Automatic Logging**: 이상 징후 감지 시 시간, 부품명, 신뢰도 및 해당 시점의 이미지를 **SQLite DB**에 자동 저장합니다[cite: 43, 54].
* [cite_start]**Interactive Dashboard**: **Chart.js**를 활용하여 구조물별 결함 빈도 및 시간대별 발생 추이를 대시보드로 시각화합니다[cite: 45, 46].
* [cite_start]**Mobile Readiness**: 모바일 브라우저에서도 카메라 연동 및 분석 기능을 동일하게 지원하여 현장 활용성을 극대화했습니다[cite: 81, 85].

## 🛠 Tech Stack
* [cite_start]**AI/ML**: Python, Ultralytics YOLOv11, OpenCV, PyTorch [cite: 36]
* [cite_start]**Backend**: Flask, Flask-SocketIO, SQLite3 [cite: 36, 53]
* [cite_start]**Frontend**: HTML5, CSS3, JavaScript (Chart.js, Socket.io) [cite: 82, 86]
* [cite_start]**Environment**: Google Colab Pro (Training), VS Code (Development) [cite: 92]

## 📊 Model Performance
[cite_start]AI HUB의 실제 도시철도 데이터를 사용하여 실제 현장 적용 가능성을 검증했습니다[cite: 35, 64].
* [cite_start]**mAP@50**: **93%** (데이터셋 베이스라인 80% 대비 우수한 정확도 확보) [cite: 62, 64]
* [cite_start]**Recall (재현율)**: **90%** 달성 [cite: 64]
* [cite_start]**Processing Speed**: 로컬 GPU 환경 기준 실시간성(30 FPS) 확보 [cite: 61, 62]

## 📂 System Architecture
[cite_start]시스템은 이미지 수집부터 데이터 시각화까지 유기적으로 연결되어 실시간으로 동작합니다[cite: 57].

1.  [cite_start]**Input**: 사용자가 카메라 시작 또는 이미지 업로드를 통해 데이터 입력[cite: 39, 40].
2.  [cite_start]**Inference**: 서버의 YOLOv11 모델이 실시간 객체 탐지 및 이상 여부 판별[cite: 42, 58].
3.  [cite_start]**Storage**: 이상 탐지 시 관련 정보를 DB에 기록하고 로그 생성[cite: 43, 59].
4.  [cite_start]**Output**: 감지 결과를 바운딩 박스로 시각화하여 클라이언트에 전송 및 통계 업데이트[cite: 44, 45, 74].

## 🚀 Getting Started

### 1. 환경 설정 (.env)
```text
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db

