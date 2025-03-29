import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song } from '../../types/Song';
import styles from './SongList.module.css';
import { load } from 'js-yaml';
import { FaSearch } from 'react-icons/fa';

export function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Generuj alfabet
  const alphabet = '#AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ'.split('');

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
          return a.title.localeCompare(b.title, 'pl');
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

  // Funkcja do sprawdzania, czy piosenka zawiera szukaną frazę
  const songMatchesSearch = (song: Song, query: string): boolean => {
    if (!query) return true;
    
    const searchLower = query.toLowerCase();
    
    // Szukaj w tytule
    if (song.title.toLowerCase().includes(searchLower)) return true;
    
    // Szukaj w treści
    for (const verse of song.verses) {
      if (verse.content.toLowerCase().includes(searchLower)) return true;
    }
    
    // Szukaj w autorze
    if (song.author?.toLowerCase().includes(searchLower)) return true;
    
    return false;
  };

  // Filtruj i grupuj piosenki
  const filteredAndGroupedSongs = () => {
    const filtered = songs.filter(song => songMatchesSearch(song, searchQuery));
    
    if (!selectedLetter) return filtered;
    
    return filtered.filter(song => {
      const firstLetter = song.title.charAt(0).toUpperCase();
      if (selectedLetter === '#') {
        return !'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ'.includes(firstLetter);
      }
      return firstLetter === selectedLetter;
    });
  };

  if (loading) {
    return <div className={styles.loading}>Ładowanie...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const groupedSongs = filteredAndGroupedSongs();

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Szukaj w tytułach i treści..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.alphabet}>
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`${styles.letterButton} ${selectedLetter === letter ? styles.selected : ''}`}
            onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className={styles.songList}>
        {groupedSongs.length === 0 ? (
          <div className={styles.noResults}>
            Nie znaleziono piosenek{searchQuery ? ' dla "' + searchQuery + '"' : ''}
          </div>
        ) : (
          groupedSongs.map(song => (
            <Link key={song.id} to={`/song/${song.id}`} className={styles.songLink}>
              <div className={styles.songItem}>
                <h3>{song.title}</h3>
                <p>{song.author}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 