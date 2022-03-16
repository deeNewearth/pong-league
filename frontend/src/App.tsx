import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Provider } from "react-redux";
import './App.scss';
import { store } from "./store/configureStore";

import NewMatchView from './components/newMatch';
import PlayersView from './components/playersView';
import MatchedView from './components/matchesView';

function App() {
  const [showNewMatch, setShowNewMatch] = useState(false);


  return (
    <Provider store={store}>
      <div className="App p-5">


        {showNewMatch && <NewMatchView onClose={() => setShowNewMatch(false)} />}

        <Button variant="primary" onClick={() => setShowNewMatch(true)}>Register new game</Button>

        <hr/>

        <PlayersView/>

        <MatchedView/>
      </div>
    </Provider>
  );
}

export default App;
