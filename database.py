import sqlite3
from datetime import datetime, timedelta
import os


class Database:
    def __init__(self, db_name=None):
        if db_name is None:
            db_name = os.getenv('DATABASE_NAME', 'railway_anomalies.db')
        self.conn = sqlite3.connect(db_name, check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.create_tables()

    def create_tables(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS anomalies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            component TEXT,
            component_kor TEXT,
            confidence REAL,
            bbox TEXT,
            image_data TEXT
        )
        ''')
        self.conn.commit()

    def add_anomaly(self, timestamp, component, component_kor, confidence, bbox, image_data):
        self.cursor.execute(
            "INSERT INTO anomalies (timestamp, component, component_kor, confidence, bbox, image_data) VALUES (?, ?, ?, ?, ?, ?)",
            (timestamp, component, component_kor, confidence, bbox, image_data)
        )
        self.conn.commit()

    def get_anomaly_history(self, days=7):
        cutoff_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M:%S")
        self.cursor.execute(
            "SELECT id, timestamp, component, component_kor, confidence, bbox FROM anomalies WHERE timestamp > ? ORDER BY timestamp DESC",
            (cutoff_date,)
        )
        rows = self.cursor.fetchall()
        history = []
        for row in rows:
            history.append({
                'id': row[0],
                'timestamp': row[1],
                'component': row[2],
                'component_kor': row[3],
                'confidence': row[4],
                'bbox': row[5]
            })
        return history

    def __del__(self):
        self.conn.close()