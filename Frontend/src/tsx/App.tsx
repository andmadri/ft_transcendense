import React, { useState, useEffect } from 'react';
import { State } from '../ts/structs';
import { Game }from '../ts/script';
import LoginComponent from './LoginComponent';

export default function App() {
  const [appState, setAppstate] = useState<State>(Game.state);

  useEffect(() => {
    const interval = setInterval(() => {
      if (appState !== Game.state) {
        setAppstate(Game.state);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [appState]);

  switch(appState) {
    case State.Login:
      return <LoginComponent />;
    // case State.Menu:
    //   return <MenuComponent />;
  }
}
