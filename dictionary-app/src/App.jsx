import React, { useState, useEffect } from "react";
import axios from "axios";
import Results from "./components/Results";
import Photos from "./components/Photos";
import { BookOpen, Loader2, History, Dices, Trash2 } from "lucide-react";
import "./App.css";

// A curated list of fascinating words for the random feature
const fascinatingWords = [
  "serendipity", "ephemeral", "luminescent", "mellifluous", "eloquent", 
  "resilience", "labyrinth", "ethereal", "effervescent", "sagacious", 
  "halcyon", "quintessential", "petrichor", "ineffable", "sonder",
  "wanderlust", "solitude", "aurora", "cascade", "enigma"
];

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("vocabHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const saveToHistory = (word) => {
    const newHistory = [word, ...history.filter(w => w !== word)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("vocabHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("vocabHistory");
  };

  const handleSearch = (word) => {
    if (!word.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    setPhotos(null);
    setKeyword(word); // Updates the input field visually

    const dictionaryApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    axios
      .get(dictionaryApiUrl)
      .then((response) => {
        setResults(response.data[0]);
        saveToHistory(word.toLowerCase());
      })
      .catch(() => {
        setError("Sorry, we couldn't find definitions for this word. Try another one!");
      })
      .finally(() => {
        fetchPhotos(word);
      });
  };

  const fetchPhotos = (word) => {
    const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 
    const unsplashApiUrl = `https://api.unsplash.com/search/photos?page=1&query=${word}&client_id=${unsplashAccessKey}&per_page=6`;

    axios
      .get(unsplashApiUrl)
      .then((response) => setPhotos(response.data.results))
      .catch((err) => console.log("Unsplash error:", err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(keyword);
  };

  const generateRandomWord = () => {
    const randomWord = fascinatingWords[Math.floor(Math.random() * fascinatingWords.length)];
    handleSearch(randomWord);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header fade-in">
          <div className="logo-container">
            <BookOpen size={36} className="logo-icon" />
          </div>
          <h1>Dictionary</h1>
          <p>Expand your knowledge, one word at a time.</p>
        </header>

        <section className="search-section fade-in">
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="search"
              value={keyword}
              placeholder="Type a word (e.g., Huge, robust...)"
              autoFocus={true}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? <Loader2 className="spinner" size={20} /> : "Search"}
            </button>
            <button 
              type="button" 
              onClick={generateRandomWord} 
              className="random-btn"
              title="Surprise me with a random word!"
              disabled={loading}
            >
              <Dices size={24} />
            </button>
          </form>

          {history.length > 0 && (
            <div className="recent-searches">
              <History size={16} className="history-icon" />
              <span>Recent:</span>
              <div className="history-tags">
                {history.map((word, index) => (
                  <button 
                    key={index} 
                    className="history-tag"
                    onClick={() => handleSearch(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
              <button onClick={clearHistory} className="clear-history-btn" title="Clear History">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </section>

        {loading && (
          <div className="loading-state fade-in">
            <Loader2 className="main-spinner" size={48} />
            <p>Unlocking the dictionary...</p>
          </div>
        )}

        {!loading && error && <div className="error-message fade-in">{error}</div>}

        {!loading && !error && (
          <main className="content-grid">
            {/* We pass handleSearch down so clicking a synonym triggers a new search */}
            <Results results={results} onSynonymClick={handleSearch} />
            <Photos photos={photos} />
          </main>
        )}
      </div>
    </div>
  );
}