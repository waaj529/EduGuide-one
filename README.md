# EduGuide AI - Final Year Project 2025

<!-- Trigger deployment -->

An AI-powered educational platform that helps students generate personalized study materials from their uploaded content.

## What it does

Basically, you upload your lecture notes or textbooks (PDFs, Word docs, etc.) and the app generates:
- Practice questions with different difficulty levels
- Quick summaries of the content
- Flashcards for memorization
- You can even chat with your PDFs to ask specific questions

I made separate views for students and teachers since they have different needs.

## Why I built this

I was struggling with creating good practice questions for exams and thought "there has to be a better way than manually making flashcards all the time." Plus, I wanted to learn more about integrating AI APIs into web apps for my FYP.

The idea came from my own experience - I'd spend hours making practice questions from textbooks when I could be actually studying. So I built this to automate that part.

## Tech stuff I used

**Frontend:**
- React with TypeScript (wanted to learn TS properly)
- Tailwind CSS for styling
- Vite for building (way faster than Create React App)
- Some UI components from shadcn/ui

**Backend:**
- Supabase for the database and authentication
- Edge Functions for the AI API calls
- PostgreSQL database

**AI Integration:**
- OpenAI GPT-4 API (main one)
- Google Gemini API (backup when OpenAI is down)
- Custom PDF processing for the chat feature

## Getting it running

You'll need:
- Node.js (I used v18)
- A Supabase account (free tier works)
- OpenAI API key (costs money but not much for testing)

```bash
git clone https://github.com/waaj529/FYP.git
cd FYP
npm install
```

Create a `.env.local` file with your API keys:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_key_here
VITE_OPENAI_API_KEY=your_openai_key_here
```

Then just run:
```bash
npm run dev
```

## How to use it

**For Students:**
1. Sign up with a student account
2. Upload your study materials (PDFs work best)
3. Choose what you want - practice questions, summaries, or flashcards
4. Start studying with the generated content

**For Teachers:**
1. Sign up with a teacher account  
2. Upload course materials
3. Generate question banks for assignments
4. Monitor how students are doing

## The AI part (technical details)

The core feature is the question generation. Here's how it works:

1. User uploads a document
2. Extract text using PDF parsing APIs
3. Send chunks to OpenAI/Gemini with prompts I fine-tuned
4. Parse the AI response into structured questions
5. Store everything in Supabase

I added error handling and fallbacks because AI APIs can be unreliable sometimes.

## Problems I ran into

- **API Rate Limits**: Had to add request queuing and retry logic
- **PDF Text Extraction**: Some PDFs are just images, so OCR doesn't always work perfectly
- **AI Response Parsing**: Sometimes the AI returns malformed JSON, so I had to add validation
- **Cost Management**: OpenAI API calls add up quickly during testing

## Current limitations

- Only works with text-based PDFs (not scanned images)
- Question quality depends on how well-written the source material is
- Can be slow with very large documents
- Costs money to run because of API usage

## What I learned

This project taught me a lot about:
- Working with AI APIs and handling their quirks
- Building responsive web apps with React
- Database design and user authentication
- Error handling and user experience design
- Managing API costs and rate limits

## Future improvements

If I had more time, I'd add:
- Better mobile support
- More question types (multiple choice, true/false, etc.)
- Study session tracking and analytics
- Collaborative features for study groups
- Better PDF text extraction for scanned documents

## Academic context

This was my FYP for Computer Science at [University]. The goal was to explore how AI can be used to enhance education and reduce the manual effort in creating study materials.

My supervisor was [Supervisor Name] who helped guide the technical architecture decisions.

## Contact

If you have questions about the code or want to collaborate:
- Email: waqj333@gmail.com
- GitHub: [@waaj529](https://github.com/waaj529)

## License

MIT License - feel free to use this code for your own projects or learning.

---

**Note:** This is a student project built for educational purposes. The AI features require API keys and will incur costs during usage.

<!-- Force Vercel deployment Fri Jun 27 07:17:00 PKT 2025 -->
