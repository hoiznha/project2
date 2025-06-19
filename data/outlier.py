import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# 1. CSV 파일 불러오기
df = pd.read_csv("lux_2025_06_11_to_17.csv")

# 2 .이상치 탐지 (특정 시간대 별)
df['timestamp'] = pd.to_datetime(df['timestamp'])

#시간대 추출
df['hour'] = df['timestamp'].dt.hour

# 시간대별 평균과 표준편차 계산
hourly_stats = df.groupby('hour')['lux'].agg(['mean', 'std']).reset_index()
hourly_stats.columns = ['hour', 'hour_mean', 'hour_std']

# 기준값 병합
df = df.merge(hourly_stats, on='hour', how='left')

# 이상치 판별 : 시간대 평균 ± 30 * 표준편차
df['is_outlier'] = (
    (df['lux']>df['hour_mean'] + 30 * df['housr_std']) |
    (df['lux']<df['hour_mean'] - 30 * df['housr_std'])
)

# 이상치 추출
outliers = df[df['is_outlier']]

# outliers.to_csv('lux_outliers_by_hour.csv', index=False)