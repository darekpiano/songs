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
        const response = await fetch(`/songs/song${id}.yaml`);
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

  return (
    <div className={styles.songDetail}>
      <div className={styles.controls}>
        <Link to="/" className={styles.backLink}>
          <FaArrowLeft />
        </Link>
        <h1 className={styles.title}>{song.title}</h1>
        <div className={styles.buttons}>
          <button
            className={`${styles.controlButton} ${showChords ? styles.active : ''}`}
            onClick={() => setShowChords(!showChords)}
            title="Toggle chords"
          >
            <FaGuitar />
          </button>
          <button
            className={`${styles.controlButton} ${showInfo ? styles.active : ''}`}
            onClick={() => setShowInfo(!showInfo)}
            title="Toggle info"
          >
            <FaInfoCircle />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className={styles.songInfo}>
          <p className={styles.author}>Author: {song.author}</p>
          <p className={styles.year}>Year: {song.year}</p>
          {song.tags && song.tags.length > 0 && (
            <div className={styles.tags}>
              {song.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {showChords && song.key && (
            <p className={styles.chordsInfo}>Key: {song.key}</p>
          )}
        </div>
      )}

      <div className={styles.songContent}>
        {song.verses.map((verse, index) => (
          <div key={index} className={styles.verse}>
            <pre className={styles.content}>
              {showChords ? verse.content : verse.content.split('\n').filter(line => !line.trim().match(/^[A-Ga-gm#b0-9\s]+$/)).join('\n')}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
} 