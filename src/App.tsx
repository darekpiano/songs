import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { SongList } from './components/SongList/SongList'
import SongDetail from './components/SongDetail/SongDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Songbook</h1>
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
