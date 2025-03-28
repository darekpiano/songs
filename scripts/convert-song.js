const fs = require('fs');
const yaml = require('js-yaml');

function parseSongText(text) {
  const lines = text.split('\n');
  const song = {
    id: Date.now().toString(),
    title: '',
    author: '',
    year: '',
    tags: [],
    key: '',
    verses: []
  };

  let currentVerse = {
    chords: '',
    lyrics: ''
  };

  for (const line of lines) {
    if (line.startsWith('[')) {
      // Nowa sekcja
      if (currentVerse.chords || currentVerse.lyrics) {
        song.verses.push(currentVerse);
        currentVerse = { chords: '', lyrics: '' };
      }
      continue;
    }

    // Sprawdź czy linia zawiera akordy (są nad tekstem)
    if (line.trim().match(/^[A-Ga-gm#b0-9\s]+$/)) {
      currentVerse.chords += line + '\n';
    } else if (line.trim()) {
      currentVerse.lyrics += line + '\n';
    }
  }

  // Dodaj ostatnią zwrotkę
  if (currentVerse.chords || currentVerse.lyrics) {
    song.verses.push(currentVerse);
  }

  return song;
}

// Przykład użycia
const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.log('Użycie: node convert-song.js input.txt output.yaml');
  process.exit(1);
}

const text = fs.readFileSync(inputFile, 'utf8');
const song = parseSongText(text);
const yamlText = yaml.dump(song, { lineWidth: -1 });

fs.writeFileSync(outputFile, yamlText);
console.log(`Piosenka została przekonwertowana i zapisana do ${outputFile}`); 