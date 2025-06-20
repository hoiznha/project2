from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.chains import LLMChain

prompt = PromptTemplate(
    input_variables=["summary", "question"],
    template="""
너는 환경 데이터를 분석하는 AI야.
다음은 6월 한 달간 시간대별 조도(lux) 평균이야:

{summary}

위 데이터를 바탕으로 다음 질문에 답변해줘:
{question}
"""
)

chain = LLMChain(
    llm=OpenAI(model="gpt-3.5-turbo-instruct", temperature=0),
    prompt=prompt
)

# 예시 질문
question = "하루 중 조도가 가장 낮은 시간대는 언제야?"
response = chain.run(summary=summary, question=question)
print(response)
