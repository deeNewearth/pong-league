import React, {useState} from 'react';
import {Button} from 'react-bootstrap';

import './App.scss';

import NewMatchView from './components/newMatch';

function App() {
  const [showNewMatch, setShowNewMatch] = useState(true);


  return (
    <div className="App">
      hello world

      {showNewMatch && <NewMatchView/>}

      <Button variant="primary" onClick={()=>setShowNewMatch(true)}>new match</Button>
    </div>
  );
}

export default App;
