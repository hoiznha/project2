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
You are a weather and environmental data expert.  
Using your knowledge of historical environmental patterns and publicly available datasets (such as multi-year light intensity data from meteorological or scientific institutions),  
please analyze the following 1-week light intensity (lux) data measured hourly and forecast tomorrow’s hourly lux values.

Here is the 1-week sensor data (hourly average values for each day):

{data}

Considering the typical seasonal and time patterns observed in June over the past five years, please predict the lighting data for the week beginning June 20 in format by date and time.
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
