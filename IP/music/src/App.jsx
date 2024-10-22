import React, { useState, useRef, useEffect } from 'react';
import MusicPlayer from './components/MusicPlayer';
import Library from './components/Library';
import './App.css';
import { addSongToDB, getSongsFromDB } from './indexedDB';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const audioRef = useRef(null);

  // Load songs from IndexedDB when the app starts
  useEffect(() => {
    const loadSongs = async () => {
      const storedSongs = await getSongsFromDB();
      setSongs(storedSongs);
      if (storedSongs.length > 0 && !currentSong) {
        setCurrentSong(storedSongs[0]);
      }
    };
    loadSongs();
  }, [currentSong]);

  // Handle file upload and save it to IndexedDB
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const newSong = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Internet Programming",
        audio: URL.createObjectURL(file),
        cover: "https://via.placeholder.com/300x300.png?text=Cover+Art"
      };
      setSongs([...songs, newSong]);
      await addSongToDB(newSong); // Save the new song to IndexedDB
    }
  };

  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <header className="App-header">
        <h1>CyberPlayer Music</h1>
      </header>
      <main>
        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
          songs={songs}
          setCurrentSong={setCurrentSong}
        />
        <div className="controls">
          <button onClick={() => setLibraryStatus(!libraryStatus)}>
            {libraryStatus ? 'Hide Library' : 'Show Library'}
          </button>
          <label className="upload-btn">
            Upload Song
            <input type="file" accept="audio/*" onChange={handleFileUpload} style={{display: 'none'}} />
          </label>
        </div>
        <Library
          songs={songs}
          setCurrentSong={setCurrentSong}
          audioRef={audioRef}
          isPlaying={isPlaying}
          setSongs={setSongs}
          libraryStatus={libraryStatus}
        />
      </main>
    </div>
  );
}

export default App;
