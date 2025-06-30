# from langchain.prompts import PromptTemplate
# from langchain.llms import OpenAI
# from langchain.chains import LLMChain
# from langchain_chat_models import ChatOpenAI

# prompt = PromptTemplate(
#     input_variables = ["data"],
#     template = "조도 센서 데이터 {data} 를 기반으로 내일의 평균 조도를 예측해줘."
# )

# chain = LLMChain(
#     llm=OpenAI(
#         model = 'gpt-3.5-turbo-instruct', #"gpt-4"
#         temperature = 0,
#     ),
#     prompt=prompt
# )
# product = "컴퓨터게임"
# print(prompt.format(product=product))
# print(chain.run(product))

from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.chains import LLMChain

prompt = PromptTemplate(
    input_variables = ["data"],
    template = """ 
You are a weather and environmental data expert, specialized in analyzing observed measurement data patterns.

Your primary task is to thoroughly analyze the patterns (daily/hourly variations, min/max values, average trends, etc.) within the provided 1-week hourly average light intensity (lux) data. This provided data should be used as the most crucial basis for your predictions.

You may use your general knowledge of typical seasonal and time patterns observed in June over the past five years (e.g., sunrise/sunset times, midday peak, nighttime minimum) as a secondary reference only. Do not attempt to access external data or run complex statistical models.

Here is the 1-week sensor data (hourly average values for each day):

{data}
Considering the patterns from the 1-week data provided above, combined with general June sunlight characteristics (e.g., sunrise around 05:00-06:00 KST, sunset around 19:30-20:00 KST, peak around 12:00-14:00 KST), please strictly generate the hourly light intensity (lux) predictions for 7 days starting from June 20, 2025, in format by date and time.
""")

chain = LLMChain(
    llm=OpenAI(
        model='gpt-3.5-turbo-instruct',
        temperature=0,
        max_tokens=3650,
    ),
    prompt=prompt
)

# 예시 데이터 (1일치 조도)
data = "40, 42, 45, 50, 70, 120, 135, 150, 160, 140, 120, 90, 70, 60, 55, 50, 45, 42, 40, 38, 36, 35, 34, 30"

# 출력
print(prompt.format(data=data))
print(chain.run(data=data))
