import React, {useState} from 'react';
import {Button} from 'react-bootstrap';

import './App.scss';

import NewMatchView from './components/newMatch';

function App() {
  const [showNewMatch, setShowNewMatch] = useState(false);


  return (
    <div className="App p-5">
      

      {showNewMatch && <NewMatchView onClose={()=>setShowNewMatch(false)}/>}

      <Button variant="primary" onClick={()=>setShowNewMatch(true)}>Register new game</Button>
    </div>
  );
}

export default App;
