from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from PyPDF2 import PdfReader
from langchain.prompts import PromptTemplate
import logging
import os
from dotenv import load_dotenv
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app and enable CORS


# Initialize Flask app and enable CORS with specific settings
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=["POST"])

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

image_upload_prompt_template = PromptTemplate(
    input_variables=["content"],
    template="Describe and analyze the following image content:\n{content}",
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

# Route for handling file uploads (PDFs and images)
@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_type = file.content_type

    try:
        # Handling PDF files
        if file_type == 'application/pdf':
            pdf = PdfReader(file)
            content = "".join(page.extract_text() for page in pdf.pages)

            # Generate notes based on the content
            formatted_prompt = notes_prompt_template.format(content=content)
            response = ""
            for chunk in client.stream([{"role": "user", "content": formatted_prompt}]):
                response += chunk.content
            return jsonify({"response": response})

        # Handling image files
        elif file_type.startswith('image/'):
            image = Image.open(file)
            # Optional: Perform OCR to extract text from image
            extracted_text = pytesseract.image_to_string(image) if image.mode == "RGB" else ""

            # Use the extracted text or description as content for the AI prompt
            content = extracted_text or "Image without detectable text content"
            formatted_prompt = image_upload_prompt_template.format(content=content)
            
            response = ""
            for chunk in client.stream([{"role": "user", "content": formatted_prompt}]):
                response += chunk.content
            return jsonify({"response": response})

        else:
            return jsonify({"error": "Unsupported file type"}), 400

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return jsonify({"error": "Failed to process file"}), 500

if __name__ == "__main__":
    app.run(port=5000)