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
    다음은 지난 6월 1주일동안의 평균 조도데이터를 1시간 간격으로 나타낸 데이터입니다.
    {data}
    이 데이터는 시간에 따라 조도가 어떻게 변화하는지 보여줍니다. 
    이 패턴을 반영해서,  내일의 1시간 단위 조도를 예측해 주세요.
""")

chain = LLMChain(
    llm=OpenAI(
        model='gpt-3.5-turbo-instruct',
        temperature=0,
    ),
    prompt=prompt
)

# 예시 데이터 (1일치 조도)
data = "40, 42, 45, 50, 70, 120, 135, 150, 160, 140, 120, 90, 70, 60, 55, 50, 45, 42, 40, 38, 36, 35, 34, 30"

# 출력
print(prompt.format(data=data))
print(chain.run(data=data))
