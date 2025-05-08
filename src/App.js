import { Routes, Route } from 'react-router-dom';

import './App.css';

import Menu from './components/Menu/Menu.js';
import Game from './components/Game/Game.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/highscores" element={<p>Display my HighScores</p>} />
      <Route path="/settings" element={<p>Display my Settings</p>} />
      <Route path="/game/:difficulty" element={<Game />} />
      <Route path="/gameover" element={<p>GameOver</p>} />
    </Routes>
  );
};

export default App;
