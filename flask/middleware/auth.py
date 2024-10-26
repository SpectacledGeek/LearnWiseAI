from functools import wraps
from flask import request, jsonify
import jwt
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                logger.error("Invalid Authorization header format")
                return jsonify({'error': 'Invalid Authorization header format'}), 401
        
        if not token:
            logger.error("No token provided")
            return jsonify({'error': 'Authentication token is missing'}), 401

        try:
            # Verify token
            data = jwt.decode(
                token, 
                os.getenv('ACCESS_TOKEN_SECRET'),
                algorithms=['HS256']
            )
            logger.info(f"Token decoded successfully for user {data.get('id')}")
            current_user_id = data['id']
            return f(current_user_id, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            logger.error(f"Unexpected error in auth middleware: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
            
    return decorated