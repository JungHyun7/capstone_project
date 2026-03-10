from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import base64
import cv2
import numpy as np
import io
from PIL import Image
import time
import json
from datetime import datetime
from detect import YOLODetector
from database import Database
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'default_secret')
socketio = SocketIO(app, cors_allowed_origins="*")

# 클래스 정보 로드
with open('yolo_class_info.json', 'r', encoding='utf-8') as f:
    class_info = json.load(f)

# YOLOv11 모델 초기화
model_path = os.getenv('YOLO_MODEL_PATH', 'best.pt')
detector = YOLODetector(model_path=model_path, class_info=class_info)

# 데이터베이스 초기화
db = Database()


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@socketio.on('image')
def handle_image(data):
    # base64 이미지 데이터 받기
    image_data = data.split(',')[1]
    image_bytes = base64.b64decode(image_data)

    # 이미지 변환
    image = Image.open(io.BytesIO(image_bytes))
    image_np = np.array(image)

    # BGR로 변환 (OpenCV 형식)
    if len(image_np.shape) == 3 and image_np.shape[2] == 4:  # RGBA 형식인 경우
        image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2BGR)
    else:
        image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # 객체 탐지 수행
    start_time = time.time()
    detections = detector.detect(image_np)
    process_time = time.time() - start_time

    # 이상 항목만 필터링
    anomalies = [det for det in detections if '_abnormal' in det['class_name']]

    # 이상이 감지된 경우 DB에 저장
    if anomalies:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        for anomaly in anomalies:
            db.add_anomaly(
                timestamp=timestamp,
                component=anomaly['class_name'],
                component_kor=anomaly['class_name_kor'],
                confidence=anomaly['confidence'],
                bbox=str(anomaly['bbox']),
                image_data=image_data  # 이미지도 함께 저장
            )

    # 결과를 클라이언트에 전송
    result = {
        'detections': detections,
        'process_time': f"{process_time:.3f}s",
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    emit('detection_result', result)


@app.route('/history', methods=['GET'])
def get_history():
    days = request.args.get('days', 7, type=int)
    history = db.get_anomaly_history(days)
    return jsonify(history)


'''if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)'''

# app.py 파일의 마지막 부분을 다음과 같이 수정
if __name__ == '__main__':
    # 포트 번호도 환경 변수에서 관리하면 배포 시 편리합니다.
    port = int(os.getenv('FLASK_PORT', 8000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True, allow_unsafe_werkzeug=True)
'''if __name__ == '__main__':
    socketio = SocketIO(app, cors_allowed_origins="*")
    socketio.run(app, host='0.0.0.0', port=8000, debug=True, allow_unsafe_werkzeug=True)'''