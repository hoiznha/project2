import pandas as pd
from pymongo import MongoClient

# 1. CSV 파일 불러오기
# df = pd.read_csv('lux_5days_simulated.csv')  # 경로 조정 필요
df = pd.read_csv('converted_lux.csv')  # 경로 조정 필요

# 2. MongoDB 연결 (로컬 )
client = MongoClient('mongodb://13.125.242.239:27017/')
db = client['sensordb']            # 사용할 DB 이름
collection = db['luxMeasurements'] # 사용할 컬렉션 이름

# 3. DataFrame → MongoDB 문서로 변환
records = df.to_dict(orient='records')
collection.insert_many(records)

print("✅ MongoDB에 데이터 저장 완료!")
