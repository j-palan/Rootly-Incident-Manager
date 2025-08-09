# Incident Suggestions Assistant

This project simulates a real-time incident replay system where each message from a transcript is analyzed by an AI assistant (via OpenAI) to extract actionable suggestions. It’s built with a Ruby on Rails backend and a modern frontend using React (Vite/Next.js).

---

## 🚀 How to Start the Server

### 1. Backend (Rails)

```bash
cd rails_api
bundle install
rails s
```

You’ll also need to add your OpenAI key in a `.env` file at the root of your rails app rails_api/:

```
OPENAI_API_KEY=your_openai_key_here
```

Make sure you have `dotenv-rails` in your Gemfile.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

This assumes the Rails server is running on `http://localhost:3000`. You can configure CORS in `config/initializers/cors.rb` if needed.

---

## 🔁 How to Simulate the Replay

1. Visit the frontend in your browser.
2. Click the **Simulate Incident** button at the top right.
3. The app will:
   - Display messages from a mocked transcript.
   - Send each message to the Rails backend.
   - The backend uses OpenAI to analyze the message for:
     - Action Items
     - Timeline Events
     - Root Cause Signals
     - Metadata Hints
     - Follow-up Tasks (after the incident is over)
   - Responses are categorized and rendered inline as each message appears.

---

## Design Decisions

- **Accessible UI:**: UI is very clean and simple, follows design techniques and rules. Colours and Icons are used as symbols.
- **UX Improvements**: There is a 'Go To Message' button beside each suggestion which allows for quick and easy message lookups for the user.
- **Context Management:** Each chat maintains a short history (up to 30 turns) to keep the assistant aware of the situation.
- **Categorization Strategy:** The assistant must label every suggestion with one of five types.

---

## What I’d Add or Improve With More Time

- **Upload Custom Transcripts:** Let users drop in their own incident logs.
- **Timeline Visualization:** Allow users to view key events along a visual timeline.
- **Advanced Reporting:** Add filters, exportable reports, and severity tags to organize suggestions.
- **Ability to save incidents, replay incidents, and organize incidents into folders**
- **Incident AI Chatbot**: Allow users to chat further with the AI given all the context from the conversation

---

## ⏱Time Spent

**Total:** ~7-8 hours

I spent extra time improving the UI, coming up with better UX features, and doing research on prompt engineering.


"# Incident-Manager" 
"# Incident-Manager" 
