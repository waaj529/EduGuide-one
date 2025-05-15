# Eleven Labs API Examples

This directory contains examples of using the Eleven Labs API for both text-to-speech and speech-to-text functionality.

## Setup

1. Create a `.env` file in this directory with your Eleven Labs API key:
   ```
   ELEVENLABS_API_KEY=your_api_key_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Speech to Text Example

The `speech_to_text_example.mts` file demonstrates how to use the Eleven Labs API to convert speech to text.

### Usage

1. Place an audio file (e.g., `sample-audio.wav`) in this directory

2. Run the example:
   ```bash
   npm start
   ```

3. The transcription will be printed to the console and saved to `transcription-result.json`

### How It Works

This example:
1. Reads an audio file
2. Sends it to the Eleven Labs Speech-to-Text API
3. Processes the response and displays the transcription

### API Parameters

The example includes these parameters:
- `model_id`: The AI model to use (default: "scribe_v1")
- `tag_audio_events`: Whether to tag events like laughter (default: true)
- `language_code`: Language of the audio (default: "eng")
- `diarize`: Whether to identify different speakers (default: true)

## Next Steps

- Try using different audio files
- Experiment with different API parameters
- Integrate the functionality into your own applications 