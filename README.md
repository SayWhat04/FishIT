# FishIT

> AI-powered flashcard generation and spaced repetition learning tool

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

FishIT is a web application designed to solve a common problem in education - the time-consuming process of creating high-quality flashcards for effective learning.

**The Problem:** Spaced repetition is a scientifically proven, effective learning method that uses flashcards to memorize information at optimal time intervals. However, the main barrier to its widespread use is the time-consuming process of creating high-quality educational flashcards.

**The Solution:** FishIT leverages artificial intelligence (Claude-3.7-sonnet) to automatically generate question-answer flashcards from text input by the user, significantly reducing the time needed to create effective learning materials.

### Key Features

- **AI-Powered Flashcard Generation**: Automatically create flashcards from pasted text
- **Manual Flashcard Creation**: Option to create flashcards manually
- **Flashcard Management**: View, edit, and delete flashcards
- **Organization System**: Group flashcards in thematic "boxes"
- **Spaced Repetition**: Integration with FSRS algorithm for optimal learning
- **User Accounts**: Simple account system for storing flashcards

## Tech Stack

### Frontend
- **Angular** (v19.2.0)
- **TypeScript** (v5.7.2)
- **Tailwind CSS** (v4) for styling
- **RxJS** (v7.8.0)

### Backend
- **Supabase**:
  - PostgreSQL database
  - Built-in user authentication
  - SDK for Backend-as-a-Service
- **Express**
   - Proxy Backend

### AI Integration
- **OpenRouter.ai**:
  - Access to various AI models (including Claude-3.7-sonnet)
  - Managed API limits and costs
  
### CI/CD & Hosting
- **GitHub Actions** for CI/CD pipelines
- **DigitalOcean** for hosting (Docker)

## Getting Started Locally

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)
- Supabase account
- OpenRouter.ai API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/FishIT.git
   cd FishIT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment files for configuration (API keys, etc.)

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:4200`

## Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run watch` - Builds the application and watches for changes
- `npm test` - Runs the test suite
- `npm run ng` - Runs Angular CLI commands

## Project Scope

### MVP Features

- AI flashcard generation from text input
- Manual flashcard creation
- Viewing, editing, and deleting flashcards
- User account system
- Integration with FSRS spaced repetition algorithm
- Organization of flashcards in thematic boxes
- Responsive web interface

### Not Included in MVP

- Custom advanced repetition algorithm
- Multi-format import (PDF, DOCX, etc.)
- Flashcard set sharing between users
- Integrations with other educational platforms
- Mobile applications
- Advanced flashcard content formatting
- Integration with external flashcard libraries

## Project Status

The project is currently in early development. Our success metrics include:

- 75% of AI-generated flashcards accepted without editing
- 75% of all flashcards created using AI rather than manually
- Average time to generate 10 flashcards under 15 seconds
- 90% of users using the app regularly (at least once a week)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by AB 