# 3. convert to text
summary = "\n".join([f"{hour:02d}시 평균: {lux} lux" for hour, lux in hourly_avg.items()])
