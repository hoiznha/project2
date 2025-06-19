## p235_app.py

from langchain.chains import LLMChain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import SimpleSequentialChain

## 첫번째 체인

data = "40, 42, 45, 50, 70, 120, 135, 150, 160, 140, 120, 90, 70, 60, 55, 50, 45, 42, 40, 38, 36, 35, 34, 30"

template = """ 다음은 지난 6월 1주일동안의 평균 조도데이터를 1시간 간격으로 나타낸 데이터입니다.
    {data}
    이 데이터는 시간에 따라 조도가 어떻게 변화하는지 보여줍니다. 
"""

prompt = PromptTemplate(
    input_variables = ["title"],
    template = template,
)

chain1 = LLMChain(
    llm = OpenAI(
        model = 'gpt-3.5-turbo-instruct', 
        temperature = 0,
    ),
    prompt = prompt,
)

## 두번째 체인

template = """ 당신은 연극 평론가입니다. 연극의 시놉시스가 주어졌을 때 그 리뷰를 작성하는 것이 당신의 임무입니다.
    시놉시스 : {synopsis}
    리뷰 :
"""

prompt = PromptTemplate(
    input_variables = ["synopsis"],
    template = template,
)

chain2 = LLMChain(
    llm = OpenAI(
        model = 'gpt-3.5-turbo-instruct', 
        temperature = 0,
    ),
    prompt = prompt,
)

overrall_chain = SimpleSequentialChain(
    chains = [chain1, chain2],
    verbose = True,
)   

print(overrall_chain.run("서울 랩소디"))

