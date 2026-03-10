import cv2
import numpy as np
import torch
from ultralytics import YOLO


class YOLODetector:
    def __init__(self, model_path, class_info):
        self.model = YOLO(model_path)
        self.class_info = class_info

    def detect(self, image):
        # YOLOv8 추론 실행
        results = self.model(image, verbose=False)

        detections = []

        for result in results:
            boxes = result.boxes.cpu().numpy()

            for i, box in enumerate(boxes):
                # 바운딩 박스 좌표 (x1, y1, x2, y2)
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # 클래스 ID 및 정보
                class_id = int(box.cls[0])
                class_name = self.class_info[str(class_id)]['name']
                class_name_kor = self.class_info[str(class_id)]['name_kor']
                original_id = self.class_info[str(class_id)]['original_id']

                # 신뢰도 점수
                confidence = float(box.conf[0])

                detection = {
                    'bbox': [x1, y1, x2, y2],
                    'class_id': class_id,
                    'class_name': class_name,
                    'class_name_kor': class_name_kor,
                    'original_id': original_id,
                    'confidence': confidence,
                    'is_abnormal': '_abnormal' in class_name
                }
                detections.append(detection)

        return detections