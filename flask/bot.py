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
notes_prompt_template = PromptTemplate(
    input_variables=["content"],
    template="Please summarize the following content into concise notes:\n{content}",
)

mcq_prompt_template = PromptTemplate(
    input_variables=["content", "topic"],
    template="Generate multiple-choice questions based on the following topic in the content:\n{topic}\n\nContent:\n{content}",
)
chat_history = []


def read_pdf(pdf):
    with open(pdf, "rb") as f:
        pdf = PdfReader(f)
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
        return text


# def display_response(response):
    
def chat_bot_notes(content, question):
    formatted_prompt = notes_prompt_template.format(content=content)
    chat_history.append({"role": "user", "content": question})
    ans = ""

    for chunk in client.stream([{"role": "user", "content": formatted_prompt}]):
        ans += chunk.content
        print(chunk.content, end="")
    chat_history.append({"role": "AI", "content": ans})

    return chat_history


def chat_bot_mcqs(content, question):
    formatted_prompt = mcq_prompt_template.format(content=content, topic=question)
    chat_history.append({"role": "user", "content": question})
    ans = ""

    for chunk in client.stream([{"role": "user", "content": formatted_prompt}]):
        ans += chunk.content
        print(chunk.content, end="")
    chat_history.append({"role": "AI", "content": ans})
    return chat_history


# prompt = PromptTemplate("letter")

pdf_content = read_pdf("D:\\Mumbaihacks\\LearnWise-AI\\flask\\15_Photosynthesis.pdf")
while True:
    user_input = input("Enter your question(Type exit to quit): ").strip()
    if user_input.lower() == "exit":
        break

    if "notes" in user_input:
        print("\nGenerating notes...\n")
        notes_history = chat_bot_notes(pdf_content, user_input)

        with open("notes.json", "w") as f:
            json.dump(notes_history, f, indent=2)
        print("\nNotes generated successfully!\n")

    elif "mcqs" in user_input:
        topic = input("Enter topic to generate mcqs: ")
        print("\nGenerating MCQs...\n")
        mcqs_history = chat_bot_mcqs(pdf_content, topic)

        with open("mcqs.json", "w") as f:
            json.dump(mcqs_history, f, indent=2)
        print("\nMCQs generated successfully!\n")
