from flask import Blueprint, request, jsonify
from middleware.auth import auth_required
from bson import ObjectId
import logging
from bot import chat_manager  # Update this import

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat/notes', methods=['POST'])
@auth_required
def generate_notes(current_user_id):
    try:
        data = request.json
        content = data.get('content')
        question = data.get('question')
        
        if not all([content, question]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        logger.info(f"Generating notes for user {current_user_id}")
        conv_id, msg_id, response = chat_manager.chat_bot_notes(
            ObjectId(current_user_id),
            content,
            question
        )
        
        return jsonify({
            "conversation_id": conv_id,
            "message_id": msg_id,
            "response": response
        })
    except Exception as e:
        logger.error(f"Error generating notes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/chat/mcqs', methods=['POST'])
@auth_required
def generate_mcqs(current_user_id):
    try:
        data = request.json
        content = data.get('content')
        topic = data.get('topic')
        
        if not all([content, topic]):
            return jsonify({'error': 'Missing required fields'}), 400
            
        logger.info(f"Generating MCQs for user {current_user_id}")
        conv_id, msg_id, response = chat_manager.chat_bot_mcqs(
            ObjectId(current_user_id),
            content,
            topic
        )
        
        return jsonify({
            "conversation_id": conv_id,
            "message_id": msg_id,
            "response": response
        })
    except Exception as e:
        logger.error(f"Error generating MCQs: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
@auth_required
def get_history(current_user_id):
    try:
        logger.info(f"Fetching chat history for user {current_user_id}")
        history = chat_manager.get_conversation_history(ObjectId(current_user_id))
        return jsonify(history)
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        return jsonify({"error": str(e)}), 500