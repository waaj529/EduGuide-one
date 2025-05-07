
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add console log to check if main.tsx is executing
console.log('main.tsx is executing');

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(<App />);
