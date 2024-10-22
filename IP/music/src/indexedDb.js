import { openDB } from 'idb';

// Initialize the database
const initDB = async () => {
  return openDB('music-player-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('songs')) {
        db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Add a song to the database
export const addSongToDB = async (song) => {
  const db = await initDB();
  await db.put('songs', song);
};

// Get all songs from the database
export const getSongsFromDB = async () => {
  const db = await initDB();
  return await db.getAll('songs');
};

// Delete a song from the database
export const deleteSongFromDB = async (id) => {
  const db = await initDB();
  await db.delete('songs', id);
};
