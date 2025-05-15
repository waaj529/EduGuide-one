// Simple test script for the speech-to-text API
const formData = new FormData();

// Create a fake audio blob for testing
const audioBlob = new Blob(['test audio content'], { type: 'audio/wav' });
formData.append('file', audioBlob, 'test-audio.wav');
formData.append('language_code', 'eng');
formData.append('tag_audio_events', 'true');
formData.append('diarize', 'true');

console.log('Sending test request to speech-to-text API...');

// Make the API call
fetch('http://localhost:5001/api/speech-to-text', {
  method: 'POST',
  body: formData,
})
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  }); 