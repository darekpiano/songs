import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Song } from '../../types/Song';
import styles from './SongDetail.module.css';
import { FaArrowLeft, FaGuitar, FaInfoCircle } from 'react-icons/fa';
import { load } from 'js-yaml';

export default function SongDetail() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChords, setShowChords] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

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
    return line.trim().match(/^[A-Ga-gm#b0-9\s]+$/);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <Link to="/" className={styles.backButton}>
            <FaArrowLeft />
          </Link>
          <h1>Songbook</h1>
        </div>
      </div>

      <div className={styles.header}>
        <h1>{song.title}</h1>
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

      <div className={styles.content}>
        {song.verses.map((verse, index) => (
          <div key={index} className={styles.verse}>
            {verse.content.split('\n').map((line, lineIndex) => {
              if (!showChords && isChordLine(line)) {
                return null;
              }
              return (
                <div key={lineIndex} className={`${styles.line} ${isChordLine(line) ? styles.chordLine : ''}`}>
                  {line}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
} 