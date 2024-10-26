from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_nvidia_ai_endpoints import ChatNVIDIA
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.prompts import PromptTemplate
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")

# Initialize NVIDIA Chat client
client = ChatNVIDIA(
    model="meta/llama3-8b-instruct",
    api_key=API_KEY,
    temperature=0.5,
    top_p=1,
    max_tokens=1024,
)

# Define prompt templates
notes_prompt_template = PromptTemplate(
    input_variables=["content"],
    template="Please summarize the following content into concise notes:\n{content}",
)

# Route for handling text messages
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    prompt = data.get('message')

    if prompt:
        try:
            response = ""
            for chunk in client.stream([{"role": "user", "content": prompt}]):
                response += chunk.content
            return jsonify({"response": response})
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            return jsonify({"error": "Failed to process request"}), 500
    return jsonify({"error": "No message provided"}), 400

# Route for handling file uploads and generating notes
@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        # Read PDF content
        pdf = PdfReader(file)
        content = ""
        for page in pdf.pages:
            content += page.extract_text()

        # Generate notes based on the content
        formatted_prompt = notes_prompt_template.format(content=content)
        response = ""
        for chunk in client.stream([{"role": "user", "content": formatted_prompt}]):
            response += chunk.content
        return jsonify({"response": response})
    except Exception as e:
        logger.error(f"Error reading PDF or generating notes: {str(e)}")
        return jsonify({"error": "Failed to process PDF"}), 500

if __name__ == "__main__":
    app.run(port=5000)
