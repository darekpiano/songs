import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Song } from '../../types/Song';
import styles from './SongDetail.module.css';
import { FaArrowLeft, FaGuitar, FaInfoCircle } from 'react-icons/fa';
import { load } from 'js-yaml';

export const SongDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChords, setShowChords] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const changeFontSize = (delta: number) => {
    setFontSize(prev => {
      const newSize = prev + delta;
      return newSize >= 12 && newSize <= 24 ? newSize : prev;
    });
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(`/songs/songs/song${id}.yaml`);
        if (!response.ok) {
          throw new Error('Song not found');
        }
        const text = await response.text();
        const data = load(text) as Song;
        setSong(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch song');
        setLoading(false);
      }
    };

    if (id) {
      fetchSong();
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !song) {
    return <div className={styles.error}>{error || 'Song not found'}</div>;
  }

  const isChordLine = (line: string) => {
    // Usuń spacje z początku i końca linii
    const trimmedLine = line.trim();
    
    // Jeśli linia jest pusta, nie jest to linia z akordami
    if (!trimmedLine) return false;
    
    // Sprawdź czy linia zawiera tylko akordy i spacje
    // Akceptujemy podstawowe akordy (A-G), z możliwymi modyfikatorami (m, #, b)
    // oraz ukośnikami dla akordów z basem (np. D/F#)
    return /^[A-G][#b]?m?(aj|dim|aug|sus)?[0-9]*(\/[A-G][#b]?)?\s*$/.test(trimmedLine) || 
           trimmedLine.split(/\s+/).every(word => 
             /^[A-G][#b]?m?(aj|dim|aug|sus)?[0-9]*(\/[A-G][#b]?)?$/.test(word)
           );
  };

  return (
    <div className={`${styles.container} song-detail`}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backButton}>
          <FaArrowLeft />
        </Link>
        <h1>Songbook</h1>
        <div className={styles.fontControls}>
          <button onClick={() => changeFontSize(-1)} className={styles.fontButton}>
            A-
          </button>
          <button onClick={() => changeFontSize(1)} className={styles.fontButton}>
            A+
          </button>
        </div>
      </div>

      <div className={styles.header}>
        <h2>{song.title}</h2>
        <div className={styles.controls}>
          <button onClick={() => setShowChords(!showChords)} className={styles.button}>
            <FaGuitar /> {showChords ? 'Hide' : 'Show'} Chords
          </button>
          <button onClick={() => setShowInfo(!showInfo)} className={styles.button}>
            <FaInfoCircle /> {showInfo ? 'Hide' : 'Show'} Info
          </button>
        </div>
      </div>

      {showInfo && (
        <div className={styles.info}>
          <p><strong>Author:</strong> {song.author}</p>
          <p><strong>Year:</strong> {song.year}</p>
          <p><strong>Key:</strong> {song.key}</p>
          {song.tags && song.tags.length > 0 && (
            <div className={styles.tags}>
              <strong>Tags:</strong>
              {song.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.content} style={{ fontSize: `${fontSize}px` }}>
        {song.verses.map((verse, index) => (
          <div key={index} className={styles.verse}>
            {verse.content.split('\n').map((line, lineIndex) => {
              if (!showChords && isChordLine(line)) {
                return null;
              }
              return (
                <div 
                  key={lineIndex} 
                  className={`${styles.line} ${isChordLine(line) ? styles.chordLine : ''}`}
                  style={{ fontSize: isChordLine(line) ? `${fontSize * 0.875}px` : `${fontSize}px` }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};