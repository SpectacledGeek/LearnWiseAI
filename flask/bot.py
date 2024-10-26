from langchain_nvidia_ai_endpoints import ChatNVIDIA
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.prompts import PromptTemplate
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import datetime
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")

# Initialize SQLAlchemy with updated import
Base = declarative_base()
engine = create_engine('sqlite:///chat_history.db', echo=True)
Session = sessionmaker(bind=engine)

# Database Models
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    conversations = relationship("Conversation", back_populates="user")

class Conversation(Base):
    __tablename__ = 'conversations'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    conversation_type = Column(String(20))  # 'notes' or 'mcqs'
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = 'messages'
    
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id'))
    role = Column(String(10))  # 'user' or 'AI'
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    conversation = relationship("Conversation", back_populates="messages")

# Create all tables
def initialize_database():
    try:
        Base.metadata.create_all(engine)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

class ChatHistoryManager:
    def __init__(self):
        try:
            self.client = ChatNVIDIA(
                model="meta/llama3-8b-instruct",
                api_key=API_KEY,
                temperature=0.5,
                top_p=1,
                max_tokens=1024,
            )
            self.notes_prompt_template = PromptTemplate(
                input_variables=["content"],
                template="Please summarize the following content into concise notes:\n{content}",
            )
            self.mcq_prompt_template = PromptTemplate(
                input_variables=["content", "topic"],
                template="Generate multiple-choice questions based on the following topic in the content:\n{topic}\n\nContent:\n{content}",
            )
            self.session = Session()
            logger.info("ChatHistoryManager initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing ChatHistoryManager: {str(e)}")
            raise

    def get_or_create_user(self, username):
        try:
            user = self.session.query(User).filter_by(username=username).first()
            if not user:
                user = User(username=username)
                self.session.add(user)
                self.session.commit()
            return user
        except Exception as e:
            self.session.rollback()
            logger.error(f"Error in get_or_create_user: {str(e)}")
            raise

    def create_conversation(self, user, conversation_type):
        try:
            conversation = Conversation(user=user, conversation_type=conversation_type)
            self.session.add(conversation)
            self.session.commit()
            return conversation
        except Exception as e:
            self.session.rollback()
            logger.error(f"Error in create_conversation: {str(e)}")
            raise

    def add_message(self, conversation, role, content):
        try:
            message = Message(conversation=conversation, role=role, content=content)
            self.session.add(message)
            self.session.commit()
            return message
        except Exception as e:
            self.session.rollback()
            logger.error(f"Error in add_message: {str(e)}")
            raise

    def read_pdf(self, pdf_path):
        try:
            # Convert string path to Path object and resolve it
            pdf_path = Path(pdf_path).resolve()
            if not pdf_path.exists():
                raise FileNotFoundError(f"PDF file not found at {pdf_path}")
            
            logger.info(f"Reading PDF from {pdf_path}")
            with open(pdf_path, "rb") as f:
                pdf = PdfReader(f)
                text = ""
                for page in pdf.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            logger.error(f"Error reading PDF: {str(e)}")
            raise

    def chat_bot_notes(self, username, content, question):
        try:
            user = self.get_or_create_user(username)
            conversation = self.create_conversation(user, 'notes')
            self.add_message(conversation, 'user', question)

            formatted_prompt = self.notes_prompt_template.format(content=content)
            ans = ""
            for chunk in self.client.stream([{"role": "user", "content": formatted_prompt}]):
                ans += chunk.content
                print(chunk.content, end="")
            
            self.add_message(conversation, 'AI', ans)
            return conversation
        except Exception as e:
            logger.error(f"Error in chat_bot_notes: {str(e)}")
            raise

    def chat_bot_mcqs(self, username, content, topic):
        try:
            user = self.get_or_create_user(username)
            conversation = self.create_conversation(user, 'mcqs')
            self.add_message(conversation, 'user', f"Generate MCQs about {topic}")

            formatted_prompt = self.mcq_prompt_template.format(content=content, topic=topic)
            ans = ""
            for chunk in self.client.stream([{"role": "user", "content": formatted_prompt}]):
                ans += chunk.content
                print(chunk.content, end="")
            
            self.add_message(conversation, 'AI', ans)
            return conversation
        except Exception as e:
            logger.error(f"Error in chat_bot_mcqs: {str(e)}")
            raise

    def get_user_history(self, username):
        try:
            user = self.session.query(User).filter_by(username=username).first()
            if not user:
                return []
            
            history = []
            for conversation in user.conversations:
                conv_history = {
                    'type': conversation.conversation_type,
                    'time': conversation.start_time,
                    'messages': []
                }
                for message in conversation.messages:
                    conv_history['messages'].append({
                        'role': message.role,
                        'content': message.content,
                        'timestamp': message.timestamp
                    })
                history.append(conv_history)
            return history
        except Exception as e:
            logger.error(f"Error in get_user_history: {str(e)}")
            raise

    def close(self):
        try:
            self.session.close()
            logger.info("Database session closed successfully")
        except Exception as e:
            logger.error(f"Error closing database session: {str(e)}")

def main():
    try:
        initialize_database()
        chat_manager = ChatHistoryManager()
        
        # Get username
        username = input("Enter your username: ").strip()
        
        # Get PDF path
        default_path = "15_Photosynthesis.pdf"
        pdf_path = input(f"Enter PDF path (press Enter for default '{default_path}'): ").strip()
        if not pdf_path:
            pdf_path = default_path
        
        # Convert relative path to absolute path
        pdf_path = Path(pdf_path).resolve()
        
        try:
            pdf_content = chat_manager.read_pdf(pdf_path)
            logger.info("PDF content loaded successfully")
        except FileNotFoundError:
            logger.error(f"PDF file not found at {pdf_path}")
            print(f"\nError: PDF file not found at {pdf_path}")
            print("Please make sure the file exists and try again.")
            return
        
        while True:
            user_input = input("\nEnter your question (Type 'exit' to quit, 'history' to view chat history): ").strip()
            
            if user_input.lower() == "exit":
                break
            
            if user_input.lower() == "history":
                history = chat_manager.get_user_history(username)
                print("\nChat History:")
                for conv in history:
                    print(f"\nConversation Type: {conv['type']}")
                    print(f"Time: {conv['time']}")
                    for msg in conv['messages']:
                        print(f"{msg['role']}: {msg['content']}")
                continue

            if "notes" in user_input.lower():
                print("\nGenerating notes...\n")
                chat_manager.chat_bot_notes(username, pdf_content, user_input)
                print("\nNotes generated and saved to database!\n")

            elif "mcqs" in user_input.lower():
                topic = input("Enter topic to generate mcqs: ")
                print("\nGenerating MCQs...\n")
                chat_manager.chat_bot_mcqs(username, pdf_content, topic)
                print("\nMCQs generated and saved to database!\n")

    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        print(f"\nAn error occurred: {str(e)}")
    finally:
        chat_manager.close()

if __name__ == "__main__":
    main()