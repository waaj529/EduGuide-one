# EduGuide AI - Educational Content Generator

A comprehensive AI-powered educational platform that helps teachers generate assignments, quizzes, and provides students with interactive learning tools.

## 🎯 Features

### For Teachers:
- **Assignment Generator**: Create custom assignments from uploaded documents
- **Quiz Generator**: Generate interactive quizzes with various question types
- **PDF Generation**: Download assignments and solutions as PDF files
- **Proximity Detection**: Count students in classroom images using YOLO

### For Students:
- **Practice Questions**: AI-generated practice materials
- **Flashcards**: Interactive learning cards
- **Speech-to-Text**: Voice input for answers
- **Text-to-Speech**: Audio generation from content
- **Progress Tracking**: Monitor learning progress
- **Review Mistakes**: Learn from previous errors

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT-4, Google Gemini
- **Audio**: ElevenLabs TTS, Speech Recognition API
- **Deployment**: Vercel/Netlify ready

## 📋 Production Deployment Checklist

### Environment Variables
Ensure these environment variables are set in production:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Security Checklist
- ✅ No hardcoded API keys in source code
- ✅ Environment-based console logging (dev only)
- ✅ Error boundaries with production-safe error display
- ✅ Form validation and sanitization
- ✅ CORS properly configured

### Performance Optimization
- ✅ Code splitting implemented
- ✅ Large bundle size warning addressed
- ✅ Image optimization
- ✅ Lazy loading for components
- ✅ Proper error handling and loading states

### Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design for mobile/tablet
- ✅ Accessibility features included

## 🚀 CI/CD Deployment

### Vercel Deployment (Recommended)

This project is configured for automatic deployment to Vercel:

1. **Connect Repository**: Import project from GitHub to Vercel
2. **Environment Variables**: Set in Vercel dashboard
3. **Automatic Deployments**: Every push to `main` triggers deployment
4. **Preview Deployments**: Pull requests get preview URLs

### Deployment Configuration

```json
Framework: Vite
Build Command: npm run build
Output Directory: dist
Node.js Version: 18.x
```

### Environment Variables Needed

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment URLs

- **Production**: https://eduguide-ai.vercel.app (auto-updated from main branch)
- **Preview**: Generated for each pull request
- **Development**: http://localhost:5173

### Build Status

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/waaj529/FYP)

## 🛠️ Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd FYP
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Add your environment variables
```

4. **Start development server**
```bash
npm run dev
```

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── common/        # Common utilities
│   ├── features/      # Feature-specific components
│   ├── icons/         # Custom icons
│   ├── layout/        # Layout components
│   └── ui/            # shadcn/ui components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── integrations/      # Third-party integrations
├── lib/               # Utility libraries
├── pages/             # Page components
├── services/          # API services
└── utils/             # Helper utilities
```

## 🔑 Key Features Implementation

### AI Integration
- Multiple AI providers (OpenAI, Gemini)
- Fallback mechanisms for API failures
- Proper error handling and user feedback

### Authentication
- Supabase Auth integration
- Protected routes
- Role-based access (Student/Teacher)

### Document Processing
- PDF text extraction
- Image OCR capabilities
- Multiple file format support

### Real-time Features
- Live document processing
- Instant PDF generation
- Real-time progress tracking

## 🐛 Known Issues & Solutions

### Large Bundle Size
The application has a large bundle size due to multiple AI integrations and PDF processing libraries. Consider:
- Implementing dynamic imports for AI services
- Code splitting by routes
- Lazy loading heavy components

### Browser Compatibility
- Requires modern browser with ES2020 support
- PDF.js may need polyfills for older browsers

## 📈 Future Enhancements

- [ ] Offline mode support
- [ ] PWA implementation
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Google for Gemini AI
- Supabase for backend services
- shadcn/ui for component library
- ElevenLabs for text-to-speech
