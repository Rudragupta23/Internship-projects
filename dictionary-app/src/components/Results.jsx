import React from "react";
import { Volume2, ExternalLink } from "lucide-react";

export default function Results({ results, onSynonymClick }) {
  if (!results) return null;

  const playAudio = () => {
    const audioObj = results.phonetics.find((phone) => phone.audio !== "");
    if (audioObj) {
      const audio = new Audio(audioObj.audio);
      audio.play();
    } else {
      alert("Audio pronunciation is not available for this word.");
    }
  };

  return (
    <div className="Results fade-in">
      <section className="word-header-section">
        <div className="word-header">
          <h2>{results.word}</h2>
          <button className="audio-btn" onClick={playAudio} title="Listen to pronunciation">
            <Volume2 size={24} />
          </button>
        </div>
        <h4 className="phonetic">{results.phonetic}</h4>
      </section>

      {results.meanings.map((meaning, index) => (
        <section key={index} className="meaning-section">
          <h3>{meaning.partOfSpeech}</h3>
          
          <ul className="definitions-list">
            {meaning.definitions.map((def, idx) => (
              <li key={idx}>
                <div className="definition">{def.definition}</div>
                {def.example && (
                  <div className="example">"{def.example}"</div>
                )}
              </li>
            ))}
          </ul>

          {meaning.synonyms?.length > 0 && (
            <div className="synonyms">
              <strong>Synonyms: </strong>
              {meaning.synonyms.map((syn, idx) => (
                <button 
                  key={idx} 
                  className="synonym-tag clickable-synonym"
                  onClick={() => onSynonymClick(syn)}
                  title={`Search for "${syn}"`}
                >
                  {syn}
                </button>
              ))}
            </div>
          )}
        </section>
      ))}

      {results.sourceUrls?.length > 0 && (
        <div className="source-links">
          <p>Source:</p>
          <a href={results.sourceUrls[0]} target="_blank" rel="noreferrer">
            {results.sourceUrls[0]} <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}