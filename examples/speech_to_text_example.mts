// Example of using Eleven Labs speech-to-text API directly with TypeScript
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';

// Load environment variables from .env file
dotenv.config();

// Check if API key is set
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error('ERROR: ELEVENLABS_API_KEY is not set in the .env file');
  process.exit(1);
}

// Set up Eleven Labs API client
const elevenLabsBaseUrl = 'https://api.elevenlabs.io/v1';

async function convertSpeechToText(audioFilePath: string): Promise<any> {
  try {
    // Verify file exists
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }
    
    console.log(`Converting speech to text: ${audioFilePath}`);
    
    // Read the audio file
    const audioFileBuffer = fs.readFileSync(audioFilePath);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', audioFileBuffer, {
      filename: path.basename(audioFilePath),
      contentType: 'audio/wav', // Set appropriate content type based on file
    });
    
    // Optional parameters
    formData.append('model_id', 'scribe_v1');
    formData.append('tag_audio_events', 'true');
    formData.append('language_code', 'eng');
    formData.append('diarize', 'true');
    
    // Make API request
    const response = await axios.post(
      `${elevenLabsBaseUrl}/speech-to-text/convert`,
      formData,
      {
        headers: {
          'xi-api-key': apiKey,
          ...formData.getHeaders(),
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data || error.message;
      console.error('API Error:', errorMsg);
    } else {
      console.error('Error:', error);
    }
    throw error;
  }
}

// Example usage
async function runExample() {
  try {
    // Replace with your audio file path
    const audioFilePath = path.resolve('./examples/sample-audio.wav');
    
    console.log('Running speech-to-text example...');
    const result = await convertSpeechToText(audioFilePath);
    
    console.log('\nTranscription Result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Save the transcription to a file
    fs.writeFileSync(
      './examples/transcription-result.json',
      JSON.stringify(result, null, 2),
      'utf8'
    );
    console.log('\nTranscription saved to transcription-result.json');
  } catch (error) {
    console.error('Failed to run example:', error);
  }
}

// Run the example
runExample(); 