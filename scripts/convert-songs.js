import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const songsDir = join(__dirname, '../public/songs');

// Funkcja do konwersji tekstu na tablicę zwrotek z akordami
function convertContentToVerses(content, key = 'G') {
  const verses = content.split('\n\n').map(verse => verse.trim());
  const chordProgressions = {
    'G': ['G', 'D', 'Em', 'C'],
    'D': ['D', 'A', 'Bm', 'G'],
    'A': ['A', 'E', 'F#m', 'D'],
    'E': ['E', 'B', 'C#m', 'A'],
    'C': ['C', 'G', 'Am', 'F']
  };

  const progression = chordProgressions[key] || chordProgressions['G'];
  
  return verses.map(verse => {
    const lines = verse.split('\n');
    let result = '';
    
    for (let i = 0; i < lines.length; i++) {
      // Dodaj linię akordów
      const chordLine = `${progression[0]}       ${progression[1]}        ${progression[2]}        ${progression[3]}`;
      result += chordLine + '\n' + lines[i];
      if (i < lines.length - 1) result += '\n';
    }
    
    return result;
  });
}

// Konwertuj wszystkie pliki piosenek
readdirSync(songsDir).forEach(file => {
  if (!file.endsWith('.json')) return;

  const filePath = join(songsDir, file);
  const song = JSON.parse(readFileSync(filePath, 'utf8'));

  // Jeśli plik jest już w nowym formacie, pomijamy go
  if (!song.content) {
    console.log(`Plik ${file} jest już w nowym formacie.`);
    return;
  }

  // Konwertuj format
  const newSong = {
    id: file.replace('song', '').replace('.json', ''),
    title: song.title,
    author: song.author,
    year: String(song.year || ''),
    tags: song.tags || [],
    key: 'G',
    verses: convertContentToVerses(song.content, 'G')
  };

  // Zapisz zaktualizowany plik
  writeFileSync(filePath, JSON.stringify(newSong, null, 2));
  console.log(`Plik ${file} został zaktualizowany.`);
});

console.log('Konwersja zakończona!'); 