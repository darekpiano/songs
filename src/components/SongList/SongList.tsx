import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song } from '../../types/Song';
import styles from './SongList.module.css';
import { load } from 'js-yaml';

export function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songPromises = [];
        
        // Sprawdź pierwsze 100 plików
        for (let id = 1; id <= 100; id++) {
          const promise = fetch(`/songs/songs/song${id}.yaml`)
            .then(async response => {
              if (!response.ok) return null;
              const text = await response.text();
              const song = load(text) as Song;
              if (!song || !song.id || !song.title) {
                console.warn(`Invalid song data in song${id}.yaml`);
                return null;
              }
              return song;
            })
            .catch(() => null);
            
          songPromises.push(promise);
        }

        const songsData = await Promise.all(songPromises);
        const validSongs = songsData.filter((song): song is Song => song !== null);
        
        validSongs.sort((a, b) => {
          if (!a.title) return 1;
          if (!b.title) return -1;
          return a.title.localeCompare(b.title);
        });
        
        setSongs(validSongs);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch songs');
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.songList}>
      {songs.map(song => (
        <Link key={song.id} to={`/song/${song.id}`} className={styles.songLink}>
          <div className={styles.songItem}>
            <h3>{song.title}</h3>
            <p>{song.author}</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 