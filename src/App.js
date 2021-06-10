import React from 'react';
import './css/index.scss';
import Body from './views/body/Body';
import Header from './views/header/Header';
import Notification from './views/notifications/Notification';

function App() {

  return (
    <div className="app">
        <Header></Header>
        <Notification></Notification>
        <Body></Body>
    </div>
  );
}

export default App;
