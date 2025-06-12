import streamlit as st
import requests
import time
import pandas as pd

if "data" not in st.session_state:
    st.session_state.data = []

st.title("💡 실시간 조도 센서 데이터")
placeholder = st.empty()

# API 호출
def fetch_sensor_value():
    try:
        response = requests.get("http://13.125.242.239:3000/get-sensor")
        if response.status_code == 200:
            data = response.json()
            light_value = int(data["value"])
            timestamp = pd.Timestamp.now()
            return {"time": timestamp, "light": light_value}
        else:
            st.warning("API 응답 실패: " + str(response.status_code))
    except Exception as e:
        st.error(f"API 요청 중 에러 발생: {e}")
    return None

# 센서값 불러오기
sensor_data = fetch_sensor_value()
if sensor_data:
    st.session_state.data.append(sensor_data)

# 최근 50개만 유지
st.session_state.data = st.session_state.data[-50:]

# 데이터프레임 만들기
df = pd.DataFrame(st.session_state.data)

# 그래프
if not df.empty:
    st.line_chart(df.set_index("time")["light"])
