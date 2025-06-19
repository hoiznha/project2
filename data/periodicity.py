from pandas.plotting import autocorrelation_plot
import matplotlib.pyplot as plt
import pandas as pd

# 글꼴 꺠짐 문제

df = pd.read_csv("lux_2025_06_11_to_17.csv")

df['timestamp'] = pd.to_datetime(df['timestamp'])

df['hour'] = df['timestamp'].dt.hour #0~23

hourly_avg= df.groupby('hour')['lux'].mean().reset_index()

plt.figure(figsize=(10, 5))
plt.plot(hourly_avg['hour'], hourly_avg['lux'], marker='o')
plt.xticks(range(0, 24))
plt.grid(True)
plt.title("시간대별 평균 조도 변화 (하루 주기 패턴)")
plt.xlabel("시간 (hour)")
plt.ylabel("평균 조도 (lux)")
plt.tight_layout()
plt.show()