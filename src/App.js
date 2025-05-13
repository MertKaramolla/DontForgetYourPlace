import { Routes, Route } from 'react-router-dom';
import { useRef } from 'react';

import './App.css';

import Menu from './components/Menu/Menu.js';
import Game from './components/Game/Game.js';
import GameOver from './components/GameOver/GameOver.js';

import Highscores from './components/Highscores/Highscores.js';

function App() {

  const highScores = useRef(null);
  const localData = localStorage.getItem("highscores");
  highScores.current = localData ? JSON.parse(localData) : [];


  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/highscores" element={<Highscores highScores={highScores} />} />
      <Route path="/settings" element={<p>Display my Settings</p>} />
      <Route path="/game/:difficulty" element={<Game />} />
      <Route path="/gameover" element={<GameOver highScores={highScores}/>} />
    </Routes>
  );
};

export default App;
