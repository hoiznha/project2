import pandas as pd
from datetime import datetime

input_file = "dataByLLM.csv"
output_file = "converted_lux.csv"

converted_rows = []

with open(input_file, 'r') as f:
    lines = f.readlines()

for line in lines[1:]:  # 첫 줄은 헤더 생략
    line = line.strip()
    if not line:
        continue

    try:
        # 예: June 20, 12:00 AM - 40 lux
        if "-" not in line:
            print(f"⚠️ '-' 누락: {line}")
            continue

        datetime_part, lux_part = line.split(" - ")
        lux_value = int(lux_part.lower().replace("lux", "").strip())

        # 날짜와 시간 파싱
        full_datetime = datetime.strptime(f"2025 {datetime_part.strip()}", "%Y %B %d, %I:%M %p")
        timestamp = full_datetime.strftime("%Y-%m-%d %H:%M:%S")

        converted_rows.append([timestamp, lux_value])

    except Exception as e:
        print(f"❌ 파싱 실패: {line} → {e}")

# DataFrame 생성 및 저장
df = pd.DataFrame(converted_rows, columns=["timestamp", "lux"])
df.to_csv(output_file, index=False)

print(f"✅ 변환 완료: {output_file}")
