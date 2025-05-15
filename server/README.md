# Speech-to-Text API Server

This server provides an API for converting audio files to text using the Eleven Labs Speech-to-Text API.

## Setup Instructions

1. **Create an Eleven Labs API Key**
   - Visit the [Eleven Labs dashboard](https://elevenlabs.io/app) and create an account
   - Navigate to your profile settings to generate an API key

2. **Set up the environment**
   - Create a `.env` file in this directory with your API key:
     ```
     ELEVENLABS_API_KEY=your_api_key_here
     ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**
   ```bash
   python speech_to_text.py
   ```
   The server will start on http://localhost:5001

## API Endpoints

### Convert Speech to Text
**POST** `/api/speech-to-text`

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: The audio file to transcribe (required)
  - `model_id`: The model to use (default: "scribe_v1")
  - `tag_audio_events`: Whether to tag audio events like laughter (default: true)
  - `language_code`: Language of the audio (default: "eng")
  - `diarize`: Whether to annotate who is speaking (default: true)

**Response:**
```json
{
  "transcription": "The transcribed text will appear here...",
  "success": true
}
```

### Health Check
**GET** `/api/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "speech-to-text-api"
}
```

## Usage Example

Using curl:
```bash
curl -X POST http://localhost:5001/api/speech-to-text \
  -F "file=@/path/to/audio/file.mp3" \
  -F "model_id=scribe_v1" \
  -F "language_code=eng"
``` 