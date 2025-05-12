import { Routes, Route } from 'react-router-dom';
import { useRef } from 'react';

import './App.css';

import Menu from './components/Menu/Menu.js';
import Game from './components/Game/Game.js';
import GameOver from './components/GameOver/GameOver.js';

import dataPackage from "./data.json";

const mockData = JSON.stringify(dataPackage);
localStorage.setItem("highscores", mockData);

function App() {

  const highScores = useRef(null);
  const localData = localStorage.getItem("highscores");
  highScores.current = localData ? JSON.parse(localData) : [];


  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/highscores" element={<p>Display my HighScores</p>} />
      <Route path="/settings" element={<p>Display my Settings</p>} />
      <Route path="/game/:difficulty" element={<Game />} />
      <Route path="/gameover" element={<GameOver highScores={highScores}/>} />
    </Routes>
  );
};

export default App;
