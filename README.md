# InterviewCoach AI

An interview preparation platform that helps candidates practice technical, behavioral, resume-based, and mock interview questions. Upload your resume, add a job description and your projects, and get practice questions, example answers, and feedback tailored to you.

**Live demo:** https://interviewcoach-ai-qaxx.onrender.com/

> The app runs on a free hosting plan, so the first load after a quiet period can take up to a minute to wake up.

## What it does

- **Resume PDF analysis:** upload your resume and the app reads the text from the PDF
- **Personalized questions:** questions based on your resume, projects, and the job description
- **Technical, behavioral, and project-based practice:** choose the kind of interview you want to prepare for
- **Interview types:** Internship, Part-Time, and Full-Time, each with a different difficulty level
- **Mock interview mode:** go through a full interview one question at a time
- **Example answers:** see what a strong answer looks like and what interviewers expect
- **Answer feedback:** get your answers scored with suggestions to improve
- **Voice answers:** record your answer, play it back, and use speech recognition to turn your speech into text

## How it works

1. You upload your resume (PDF), paste the job description, and list your projects.
2. You pick an interview type: Internship, Part-Time, or Full-Time.
3. The app builds a set of questions around your background and the role.
4. You answer by typing or speaking, and the app evaluates your answer and shows you an example of a strong one.

The server can also connect to the OpenAI API, and the core features (question generation and answer scoring) also work without it.

## Built with

| Part | Technology |
|------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js and Express |
| Resume parsing | PDF.js |
| Voice | Web Speech API (speech recognition) and browser microphone recording |
| AI | OpenAI API |
| API style | REST |
| Hosting | Render |

## Run it on your computer

You need Node.js installed.

1. Download the project:
   ```bash
   git clone <this repository's URL>
   cd AI-Interview-Assistant
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Optional: to use the OpenAI features, create a `.env` file in the project folder and add your OpenAI API key.
4. Start the server (run this from the folder that contains `server.js`):
   ```bash
   node server.js
   ```
5. Open http://localhost:3000 in your browser.

Voice features work best in Chrome, and your browser will ask for microphone permission the first time.

## Author

Built by Shasmith Reddy Dokuri.
