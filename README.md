<<<<<<< HEAD
# ai-counselor
=======
# AI Counselor - Professional Mental Health Support

A professional AI counselor built with Next.js and DeepSeek API, designed to provide compassionate, unbiased, and professional mental health support.

## Features

- 🤖 **Professional AI Counselor**: Powered by DeepSeek's advanced language model
- 💙 **Compassionate Support**: Warm, empathetic responses while maintaining professionalism
- 🛡️ **Unbiased & Neutral**: Non-judgmental support regardless of background or beliefs
- 🌍 **Bilingual Support**: Full support for both English and Chinese languages
- 🚨 **Crisis Detection**: Automatic detection of crisis situations with appropriate resources
- 📱 **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- 🔒 **Privacy Focused**: No data storage, conversations are not saved

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- DeepSeek API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-counselor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```
   
   Get your DeepSeek API key from: https://platform.deepseek.com/

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Choose your language**: Use the language toggle in the header to switch between English and Chinese
2. **Start a conversation**: The AI counselor will greet you with a warm welcome in your chosen language
3. **Share your thoughts**: Type your message in the input field
4. **Receive support**: Get professional, compassionate responses in the same language
5. **Continue the conversation**: The AI remembers your conversation context and maintains language consistency

## Safety Features

- **Crisis Detection**: Automatically detects mentions of self-harm or suicidal thoughts
- **Crisis Resources**: Provides immediate access to crisis hotlines and resources
- **Professional Boundaries**: Clear about limitations and encourages professional help when needed
- **Disclaimers**: Clear warnings about AI limitations and the importance of professional care

## Important Disclaimers

⚠️ **This AI counselor is designed to provide general support and should NOT replace professional mental health care.**

- If you're experiencing a crisis or need immediate help, please contact:
  - National Suicide Prevention Lifeline: 988
  - Crisis Text Line: Text HOME to 741741
  - Emergency Services: 911

- Always consult with qualified mental health professionals for serious concerns
- This tool is for general support and guidance only

## Technical Details

### Built With

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **DeepSeek API** - Advanced language model for counseling responses
- **Lucide React** - Beautiful icons

### Architecture

- **Frontend**: React components with TypeScript
- **API Routes**: Next.js API routes for backend functionality
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: DeepSeek API with professional counseling prompts

### Key Components

- `app/page.tsx` - Main chat interface with language support
- `app/api/counselor/route.ts` - API endpoint for counselor responses with bilingual support
- `app/i18n/translations.ts` - Translation files for English and Chinese
- `app/contexts/LanguageContext.tsx` - React context for language management
- `app/components/LanguageToggle.tsx` - Language switching component
- `app/globals.css` - Global styles and Tailwind configuration
- `tailwind.config.js` - Custom design system configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you need help with the application or have questions about mental health support:

- For technical issues: Open an issue on GitHub
- For mental health support: Contact a qualified mental health professional
- For crisis situations: Call 988 or text HOME to 741741

---

**Remember**: Your mental health matters. This AI counselor is here to support you, but professional help is always the best option for serious concerns. 
>>>>>>> 5db0fe0 (Initial commit: AI Counselor with bilingual support)
