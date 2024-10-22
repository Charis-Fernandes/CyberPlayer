import React from 'react';
import './Library.css';

const Library = ({ songs, setCurrentSong, audioRef, isPlaying, setSongs, libraryStatus }) => {
  const songSelectHandler = (song) => {
    setCurrentSong(song);
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioRef.current.play();
        });
      }
    }
  };

  return (
    <div className={`library ${libraryStatus ? 'active' : ''}`}>
      <h2>Library</h2>
      <div className="library-songs">
        {songs.map((song) => (
          <div
            className={`library-song ${song.id === audioRef.current?.id ? "selected" : ""}`}
            key={song.id}
            onClick={() => songSelectHandler(song)}
          >
            <img src={song.cover} alt={song.title} />
            <div className="song-description">
              <h3>{song.title}</h3>
              <h4>{song.artist}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;