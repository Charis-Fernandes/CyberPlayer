import React, { useState, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ currentSong, isPlaying, setIsPlaying, audioRef, songs, setCurrentSong }) => {
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  });

  useEffect(() => {
    if (currentSong) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioRef.current.play();
        }).catch(error => {
          console.log("Playback prevented. Require interaction first.");
        });
      }
      setIsPlaying(true);
    }
  }, [currentSong, audioRef, setIsPlaying]);

  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.log("Playback prevented. Require interaction first.");
      });
      setIsPlaying(true);
    }
  };

  const getTime = (time) => {
    return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const skipTrackHandler = (direction) => {
    if (!currentSong || songs.length === 0) return;
    
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (currentIndex === -1) currentIndex = 0;
    
    if (direction === 'skip-forward') {
      setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === 'skip-back') {
      if ((currentIndex - 1) % songs.length === -1) {
        setCurrentSong(songs[songs.length - 1]);
        return;
      }
      setCurrentSong(songs[(currentIndex - 1 + songs.length) % songs.length]);
    }
  };

  const shuffleHandler = () => {
    if (songs.length === 0) return;
    let randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSong(songs[randomIndex]);
  };

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    setSongInfo({ ...songInfo, currentTime: current, duration });
  };

  return (
    <div className="music-player">
      <div className="song-info">
        <img src={currentSong?.cover} alt={currentSong?.title} />
        <h2>{currentSong?.title || "No song selected"}</h2>
        <h3>{currentSong?.artist || "Unknown Artist"}</h3>
      </div>
      <div className="player-controls">
        <input
          type="range"
          min={0}
          max={songInfo.duration || 0}
          value={songInfo.currentTime}
          onChange={dragHandler}
        />
        <div className="time-control">
          <p>{getTime(songInfo.currentTime)}</p>
          <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
        </div>
        <div className="play-control">
          <button className="skip-back" onClick={() => skipTrackHandler('skip-back')}>
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="play" onClick={playSongHandler}>
            <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
          </button>
          <button className="skip-forward" onClick={() => skipTrackHandler('skip-forward')}>
            <i className="fas fa-step-forward"></i>
          </button>
          <button className="shuffle" onClick={shuffleHandler}>
            <i className="fas fa-random"></i>
          </button>
        </div>
      </div>
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong?.audio}
      ></audio>
    </div>
  );
};

export default MusicPlayer;