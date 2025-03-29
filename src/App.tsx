import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { SongList } from './components/SongList/SongList'
import { SongDetail } from './components/SongDetail/SongDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Songbook</h1>
          <div className="bible-quote">
            "Śpiewajcie Panu pieśń nową, śpiewajcie Panu, wszystkie krainy!" 
            <div className="quote-source">Psalm 96:1</div>
          </div>
          <div className="author">
            darekPiano - DΣigma
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<SongList />} />
            <Route path="/song/:id" element={<SongDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
