# 1. mongoDB에서 조도데이터 가져오기
from pymongo import MongoClient
import pandas as pd

client = MongoClient("mongodb://13.125.242.239:27017")
collection = client["sensorDB"]["lux_data"]

# 6월 데이터만 추출
cursor = collection.find({
    "timestamp": {
        "$gte": pd.Timestamp("2025-06-01"),
        "$lt": pd.Timestamp("2025-07-01")
    }
})

df = pd.DataFrame(list(cursor))
