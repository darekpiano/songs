import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { dump } from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const songsDir = path.join(__dirname, '../public/songs');

// Funkcja do konwersji pojedynczego pliku
function convertFile(filename) {
  const jsonPath = path.join(songsDir, filename);
  const yamlPath = path.join(songsDir, filename.replace('.json', '.yaml'));

  try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);
    const yamlContent = dump(data, { lineWidth: -1 });
    fs.writeFileSync(yamlPath, yamlContent);
    console.log(`Converted ${filename} to YAML`);
  } catch (err) {
    console.error(`Error converting ${filename}:`, err);
  }
}

// Konwertuj wszystkie pliki JSON
fs.readdirSync(songsDir)
  .filter(file => file.endsWith('.json'))
  .forEach(convertFile);

console.log('Conversion complete!'); 