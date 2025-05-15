import os
from dotenv import load_dotenv
from io import BytesIO
import requests
from elevenlabs.client import ElevenLabs
from flask import Flask, request, jsonify
import tempfile

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Initialize Eleven Labs client
client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        # Check if file is in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        audio_file = request.files['file']
        
        # Check if file has a name
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Create a temporary file to store the uploaded audio
        with tempfile.NamedTemporaryFile(delete=False) as temp:
            audio_file.save(temp.name)
            
            # Process with Eleven Labs
            with open(temp.name, 'rb') as f:
                audio_data = BytesIO(f.read())
                
                # Optional parameters
                model_id = request.form.get('model_id', 'scribe_v1')
                tag_audio_events = request.form.get('tag_audio_events', 'true').lower() == 'true'
                language_code = request.form.get('language_code', 'eng')
                diarize = request.form.get('diarize', 'true').lower() == 'true'
                
                # Convert speech to text
                transcription = client.speech_to_text.convert(
                    file=audio_data,
                    model_id=model_id,
                    tag_audio_events=tag_audio_events,
                    language_code=language_code,
                    diarize=diarize,
                )
                
                # Return the transcription
                return jsonify({
                    'transcription': transcription,
                    'success': True
                })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up temporary file
        if 'temp' in locals():
            os.unlink(temp.name)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'speech-to-text-api'})

if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv("ELEVENLABS_API_KEY"):
        print("Warning: ELEVENLABS_API_KEY is not set in the environment variables.")
        print("Please create a .env file with your API key or set it directly in the environment.")
    
    # Run the Flask app
    app.run(debug=True, port=5001) 