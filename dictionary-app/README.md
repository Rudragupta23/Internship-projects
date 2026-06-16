# 📖 Dictionary App

Dictionary App is a modern, responsive, and highly interactive dictionary application built with React and Vite. It goes beyond simple definitions by providing a rich visual and auditory learning experience, wrapping it all in a sleek "Midnight Glass" dark mode interface.

## ✨ Features

* **Comprehensive Definitions:** Fetches meanings, parts of speech, and example sentences in real-time.
* **Visual Context:** Integrates with the Unsplash API to display a beautiful masonry grid of high-quality images related to the searched word.
* **Audio Pronunciation:** Listen to the correct pronunciation of words with a single click.
* **Interactive Synonyms:** Synonyms are clickable! Click any synonym to instantly fall down a vocabulary rabbit hole and search for that new word.
* **"Surprise Me" Engine:** Don't know what to search? Click the dice icon to fetch a random, fascinating word from a curated list.
* **Smart History:** Automatically saves your 5 most recent searches to local storage for quick access, with a quick-clear option.
* **Premium UI/UX:** Features a custom "glassmorphism" design, smooth CSS animations, fading transitions, and loading spinners.

## 🛠️ Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React.js |
| Build Tool | Vite |
| Styling | CSS3, Glassmorphism |
| API Calls | Axios |
| Icons | Lucide React |
| State Management | React Hooks |
| APIs | Free Dictionary API, Unsplash API |

## 🔗 APIs Used

### Free Dictionary API
Provides:
- Word definitions
- Parts of speech
- Example sentences
- Pronunciations

### Unsplash API
Provides:
- High-quality word-related images
- Dynamic visual content

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js installed on your machine. You will also need a free developer Access Key from Unsplash.

## Installation


### 1. Clone the Repository

```bash
git clone https://github.com/Rudragupta23/Internship-projects.git
cd dictionary-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project and add your Unsplash Access Key:

```env
VITE_UNSPLASH_ACCESS_KEY=your_actual_unsplash_access_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to:

```text
http://localhost:5173/
```

Your application should now be running locally.

---

## 📂 Project Structure

```plaintext
dictionary-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Photos.jsx
│   │   └── Results.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Future Enhancements

- Add multiple language support
- Save favorite words
- Daily vocabulary challenge
- AI-powered word suggestions
- User authentication
- Dark/Light mode toggle
