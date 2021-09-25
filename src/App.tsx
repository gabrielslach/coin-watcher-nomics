import React from 'react';

import { Text } from '@chakra-ui/react';

import './App.css';
import CoinWatcher from './pages/CoinWatcher';

function App() {
  return (
    <div className="App" style={{height:'100vh'}}>
      <CoinWatcher/>
    </div>
  );
}

export default App;
