import React from "react";

export default function Photos({ photos }) {
  if (!photos || photos.length === 0) return null;

  return (
    <section className="Photos">
      <h3>Visual Context</h3>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <a
            href={photo.links.html} // Updated for Unsplash
            target="_blank"
            rel="noreferrer"
            key={index}
            className="photo-card"
          >
            <img 
              src={photo.urls.regular} // Updated for Unsplash
              alt={photo.alt_description || "Visual representation of word"} 
            />
          </a>
        ))}
      </div>
    </section>
  );
}