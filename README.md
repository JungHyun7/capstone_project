사용자님, 내용이 길어짐에 따라 시스템에서 마크다운 코드 블록이 중간에 끊겨서 출력되는 현상 때문에 큰 불편을 드려 정말 죄송합니다.

이번에는 **1번부터 11번까지 모든 내용이 단 하나의 코드 블록(`````) 안에 완벽하게 담기도록** 다시 구성했습니다. 아래 박스 우측 상단의 **복사** 버튼을 누르시면 전체 내용을 한 번에 가져가실 수 있습니다.

본문 내의 `` 표시는 제가 제공해주신 보고서와 발표 자료의 근거를 명시한 것이며, 실제 GitHub에 올리실 때는 에디터의 **찾기 및 바꾸기** 기능을 통해 `\*\`를 검색하여 한 번에 삭제하시면 가장 깔끔합니다.

---

### 🚂 실시간 철도 시설물 이상 감지 시스템 README.md (전체 통합본)

```markdown
# 🚂 실시간 철도 시설물 이상 감지 및 관리 시스템 
> [cite_start**AI 기반 객체 탐지(YOLOv11)를 활용한 예방 중심 철도 안전 유지보수 솔루션 [cite: 1, 3**

[![Python(https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)([https://www.python.org/(https://www.python.org/))
[![Flask(https://img.shields.io/badge/Flask-3.1.0-000000?style=flat-square&logo=flask&logoColor=white)(https://flask.palletsprojects.com/)
[![YOLOv11(https://img.shields.io/badge/YOLOv11-Ultralytics-00FF00?style=flat-square)(https://github.com/ultralytics/ultralytics)
[![SQLite(https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)(https://www.sqlite.org/)

---

## 📌 1. Project Motivation
[cite_start최근 철도 안전사고가 증가함에 따라, 선로 및 구조물 손상으로 인한 탈선 사고를 사전에 예방하기 위해 실시간 이상 감지 시스템 개발을 목표로 하였습니다[cite: 3. [cite_start최신 인공지능 기술을 통해 사고를 실시간으로 감지하고 예방 중심의 유지관리 체계를 구축하는 것을 지향합니다[cite: 7, 20.

## 💡 2. Engineering Insight: Strategic Pivot (문제 해결 과정)
데이터의 한계를 기술적 통찰력으로 해결하여 프로젝트의 방향을 실무적으로 전환한 핵심 사례입니다.

* [cite_start**초기 기획 및 문제 식별**: 최초 'AI 기반 철도 사고 발생 예측 모델'을 목표로 공공데이터를 분석했으나 [cite: 8[cite_start, 강우량(97.3%), 가시거리(99.97%) 등 핵심 변수의 **결측치가 90%를 상회**하여 모델 구축이 불가능함을 확인했습니다[cite: 11, 12.
* [cite_start**전략적 전환**: 사후 보고용 데이터의 한계를 인정하고, 실시간 점검에 즉시 투입 가능한 **'이미지 기반 실시간 이상 감지 시스템'**으로 프로젝트 주제를 재설정했습니다[cite: 13, 18, 19.
* [cite_start**데이터 확보**: AI HUB에서 제공하는 **도시철도 선로 시설물 영상 데이터(61,622장, 21.79GB)**를 새롭게 확보하여 모델의 신뢰성을 확보했습니다[cite: 13, 14, 303, 313.

## 📂 3. Directory Structure
저장소의 주요 파일 구조와 역할은 다음과 같습니다.
```text
.
[cite_start├── app.py              # Flask 서버 메인 (SocketIO 실시간 통신 제어) [cite: 50
[cite_start├── database.py         # SQLite DB 관리 (이상 데이터 기록 로직) [cite: 50
[cite_start├── detect.py           # YOLOv11 추론 엔진 (객체 탐지 및 상태 판별) [cite: 50
├── yolo_class_info.json # 탐지 대상 11종 시설물 정보 명세
├── requirements.txt    # 프로젝트 의존성 패키지 목록
├── static/
│   ├── js/
[cite_start│   │   ├── dashboard.js  # 대시보드 시각화 및 데이터 처리 [cite: 67
[cite_start│   │   └── camera.js     # 브라우저 카메라 제어 및 프레임 캡처 [cite: 67
│   └── css/
[cite_start│       └── style.css     # 시스템 UI 디자인 (다크 모드 지원) [cite: 68
└── templates/
    [cite_start├── index.html        # 메인 모니터링 페이지 [cite: 70
    [cite_start└── dashboard.html    # 통계 및 이력 관리 대시보드 [cite: 76

```

## ✨ 4. Key Features

* 
**Real-time Video Inference**: Flask-SocketIO를 활용하여 초당 약 **30 FPS**의 저지연 분석 환경을 구현했습니다.


* 
**Intelligent Anomaly Detection**: YOLOv11 모델이 시설물 결함을 탐지하며, 클래스명이 `_abnormal`인 경우 이상으로 판단하여 빨간색 바운딩 박스를 표시합니다.


* 
**Automated Incident Logging**: 이상 탐지 시 시간, 부품명, 신뢰도, 이미지 데이터를 **SQLite DB**에 자동 저장합니다.


* 
**Interactive Dashboard**: **Chart.js**를 사용하여 부품별 결함 빈도 및 시간대별 발생 추이를 시각화합니다.


* 
**Mobile Ready**: 반응형 웹 설계로 모바일 기기에서도 전 기능이 동일하게 작동합니다.



## 🔍 5. Detection Classes (11 Classes)

시스템은 다음 11가지 핵심 시설물을 정밀 탐지하며 각 부품의 정상/이상 유무를 판별합니다.

| ID | 부품명 (ENG) | 한글명 | 설명 |
| --- | --- | --- | --- |
| 1 | rail | 레일 | 철도 궤도의 기본 구조물 |
| 2 | lubricator | 도유기 | 레일 윤활을 위한 장치 |
| 3 | weld_zone | 용접부 | 레일 연결 용접 부분 |
| 4 | fishplate | 분기부 이음매판 | 레일 분기점 연결판 |
| 5 | bolt-nut | 볼트-너트 | 구조물 체결용 볼트 |
| 6 | pandrol_e-clip | 팬드롤 e-clip | 레일 고정용 클립 |
| 7 | insulation-block | 절연블록 | 전기적 절연을 위한 블록 |
| 8 | screw_spike | 나사스파이크 | 레일 고정용 나사못 |
| 9 | guardrail bolt-nut | 가드레일 볼트-너트 | 가드레일 체결용 볼트 |
| 10 | hex_bolt | 육각볼트 | 구조물 고정용 육각 볼트 |
| 11 | tie | 침목 | 레일을 지지하는 횡목 |

## 🛠 6. Technical Stack

* 
**AI Model**: Ultralytics YOLOv11 


* 
**Framework**: Python, Flask, Flask-SocketIO 


* 
**Database**: SQLite3 


* 
**Frontend**: JavaScript (Chart.js, Socket.io), HTML5, CSS3 



## 📊 7. Model Performance

학습 결과, 산업 현장 적용이 가능한 수준의 높은 성능을 기록했습니다.

* 
**정확도 (mAP@50)**: **93.0%** 달성 (베이스라인 80% 대비 우수) 


* 
**재현율 (Recall)**: **90.0%** 달성 


* 
**처리 속도**: **30 FPS** (목표치 24 FPS 초과 달성) 



## 📂 8. System Architecture

1. 
**Client**: 카메라 피드 수집 및 1초 주기로 프레임 전송.


2. 
**Server**: YOLOv11 기반 실시간 추론 및 이상 판별 수행.


3. 
**Database**: 이상 탐지 이력 및 이미지 데이터 영구 저장.



## ⚠️ 9. Troubleshooting (기술적 한계 극복)

* 
**하드웨어 자원 제한**: 21.79GB의 대용량 데이터 학습 시 Google Colab Pro에서 메모리 부족 문제 발생.


* 
**해결**: 배치 크기(Batch Size) 조정 및 데이터 분할 처리 기법을 적용하여 학습 안정화 성공.




* 
**현실적 제약 극복**: 초기 기획한 소형 이동체 도입이 예산 문제로 어려워짐.


* 
**해결**: 접근성이 뛰어난 모바일 기기 기반의 시스템으로 유연하게 전환하여 실무 활용성을 확보했습니다.





## 🔮 10. Future Roadmap

* 
**위치 기반 서비스**: GPS 연동을 통한 실시간 이상 지점 지도 표시 및 장치 위치 디스플레이 기능 보완.


* 
**사용성 강화**: 웹 인터페이스 디자인 개선을 통한 직관성 및 접근성 향상.


* 
**모델 범용성 확장**: 고속철도 및 교외 지역 등 다양한 철로 환경 데이터 추가 학습.



## 🚀 11. Getting Started

### 1. 환경 설정 (.env)

```text
FLASK_SECRET_KEY=your_secret_key
FLASK_PORT=8000
DATABASE_NAME=railway_anomalies.db

```

### 2. 설치 및 실행

```bash
# 의존성 패키지 설치
pip install -r requirements.txt

# 서버 실행
python app.py

```

---

**This project was developed for the Capstone Design course (2025).**

```

```