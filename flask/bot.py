from langchain_nvidia_ai_endpoints import ChatNVIDIA
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.prompts import PromptTemplate
import json

load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")
client = ChatNVIDIA(
    model="meta/llama3-8b-instruct",
    api_key=API_KEY,
    temperature=0.5,
    top_p=1,
    max_tokens=1024,
)
# creating a prompt template
prompt_template = PromptTemplate(
    input_variables=["content", "information"],
    template="Here is some information from a PDF:\n{content}\n\nBased on this information, please answer the following question: {question}.",
)
chat_history = []


def read_pdf(pdf):
    with open(pdf, "rb") as f:
        pdf = PdfReader(f)
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
        return text


def chat_bot(content, question):
    formatted_prompt = prompt_template.format(content=content, question=question)
    chat_history.append({"role": "user", "content": question})
    ans = ""

    for chunk in client.stream([{"role": "user", "content": formatted_prompt}]):
        ans += chunk.content
        print(chunk.content, end="")
    chat_history.append({"role": "AI", "content": ans})

    return chat_history


# prompt = PromptTemplate("letter")
user_question = "What is the purpose of this letter?"
pdf_content = read_pdf("D:\\Mumbaihacks\\LearnWise-AI\\flask\\letter.pdf")

chat_bot(pdf_content, user_question)
with open("D:\\Mumbaihacks\\LearnWise-AI\\flask\\chat_history.json", "w") as f:
    json.dump(chat_history, f, indent=4)
