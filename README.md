# Incident Manager

This project delivers a streamlined **incident replay simulation** that helps responders capture valuable insights in real time. Messages from an incident transcript are played back into the application at accelerated speed, where an **AI assistant (via OpenAI)** analyzes each message and surfaces actionable suggestions.

The system is built on a **Ruby on Rails backend API** paired with a **modern React frontend** (Next.js/vite), providing both reliable server-side processing and a smooth, interactive UI.

---

## ⭐ Getting Started...

### 1. Backend (Ruby on Rails)

```bash
cd rails_api
bundle install
$Env:OPENAI_API_KEY = "your_key_here"
rails s
```
For local development, you can store your OpenAI API key in a .env file inside the backend/ directory:

```bash
OPENAI_API_KEY=your_key_here
```
Ensure dotenv-rails is included in your Gemfile to automatically load environment variables in development mode.

### 2) Frontend (React + Next.js/vite)
```bash
cd client
npm install
npm run dev
```
By default, the frontend expects the Rails API to be available at:
http://localhost:3000

## 🔁 Simulating an Incident Replay
1. Launch the frontend in your browser.  
2. Click **"Simulate Incident"** in the header bar.

The application will:

- Play back the sample transcript messages in sequence.  
- Forward each message to the backend API.  
- Have the Rails API process each message using OpenAI to determine:  
  - **Action Items**  
  - **Timeline Events**  
  - **Root Cause Signals**  
  - **Metadata Hints**  
  - **Post-Incident Follow-Ups**  
- Display categorized suggestions alongside the relevant transcript messages in real time.

---

## 🧠 Key Design Choices

### Accessible & Intuitive UI  
Minimal, uncluttered layout following established design principles.  

Colours and icons act as meaningful visual symbols. Clicking an element triggers a subtle, colour-matched highlight to focus attention on the selected item.

### Data Visualization  
Interactive pie chart with a carefully chosen, accessible colour palette aligned to the UI theme.  

Segments follow data-viz best practices for clarity, contrast, and proportional accuracy, ensuring information is digestible at a glance.

### UX Enhancements  
“**Jump**” link beside each suggestion for instant jump to the originating transcript message. Highlghts in the category colour.

### Context Preservation  
Each analysis includes up to 20 prior conversation turns so the AI maintains continuity when evaluating messages.

---

## 📌 Potential Future Improvements

With additional time, this project could expand into a more comprehensive incident-management toolkit:

- **Custom Transcript Uploads** – Allow users to upload and replay their own incident meeting transcripts.  
- **Timeline Visualization** – Interactive chronological view of key incident events.  
- **Severity and Priority Tagging** – Auto-assign urgency levels to suggestions.  
- **Search & Filtering** – Quickly find suggestions by category, keyword, or severity.  
- **Export & Reporting** – Download suggestions and timelines as PDF, CSV, or JSON for audits and retrospectives.  
- **Multi-Incident Dashboard** – Organize and group related incidents for faster context switching.  
- **Collaborative Review Mode** – Let multiple team members annotate, approve, or dismiss suggestions in real time.  
- **Conversational AI Assistant** – Chat directly with the AI using the complete incident history for deeper analysis.  
- **Integration Hooks** – Push actionable items directly into Jira, Slack, PagerDuty, or other workflow tools.  
- **Performance Analytics** – Track detection accuracy, false positives, and resolution speed over time.

---

## ⏱ Development Time

**Total:** ~ 8-10 hours  

Most of the effort focused on:

- Backend development 
- Adding subtle UX touches to make the tool feel responsive and polished.  
- Iterating on prompt engineering to improve suggestion accuracy and category consistency."# Rootly-Incident-Manager" 
