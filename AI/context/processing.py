# 2. 필요한 데이터로 가공
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['hour'] = df['timestamp'].dt.hour

# 시간대별 평균 조도
hourly_avg = df.groupby('hour')['lux'].mean().round(1)
