import React from 'react';
import logo from './logo.svg';
import './App.scss';
import List from './components/List';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Playlist: </p>
        <List/>
      </header>
    </div>
  );
}

export default App;
