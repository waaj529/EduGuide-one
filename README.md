# Speech-to-Text Implementation with Eleven Labs

This project implements speech-to-text functionality using the Eleven Labs API. It includes both a server-side implementation and a React frontend component.

## Features

- **Direct Audio Recording**: Record audio directly in the browser
- **File Upload**: Upload existing audio files for transcription
- **Real-time Transcription**: Convert spoken audio to text
- **Multiple Languages**: Support for various languages
- **Advanced Options**: Speaker diarization and audio event tagging
- **API Integration**: Seamless integration with Eleven Labs API

## Project Structure

- `/server`: Python Flask server for handling API requests
- `/src/components/features/SpeechToText.tsx`: React component for the frontend
- `/src/services/api.ts`: API client for making requests to the server
- `/examples`: Example code for using the API directly

## Setup Instructions

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your Eleven Labs API key:
   ```
   ELEVENLABS_API_KEY=your_api_key_here
   ```

4. Start the server:
   ```bash
   python speech_to_text.py
   ```

### Frontend Integration

The React component can be imported and used in your application:

```jsx
import SpeechToText from '@/components/features/SpeechToText';

function MyApp() {
  const handleTranscription = (text) => {
    console.log("Transcription result:", text);
  };

  return (
    <div>
      <h1>My Speech-to-Text App</h1>
      <SpeechToText onTranscriptionComplete={handleTranscription} />
    </div>
  );
}
```

## Direct API Usage

For direct usage of the Eleven Labs API without the React component, see the examples in the `/examples` directory.

## Requirements

- Python 3.7+
- Node.js 14+
- Eleven Labs API key (https://elevenlabs.io/app)

---

# Welcome to your EduGuide FYP

## Project info

# Step 1: Clone the repository using the project's Git URL.
git clone (https://github.com/wajidabbas33/edu-guide.git)

# Step 2: Navigate to the project directory.
cd <EduGuide>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

