import React from 'react';
import { Route } from 'react-router';
import Body from './views/body/Body';
import Header from './views/header/Header';
import Menu from './views/menu/Menu';
import Notification from './views/notifications/Notification';
import Table from './views/table/Table';
import Chat from './views/chat/Chat';

function App(props) {
  return (
    <div className="app">
        <Header></Header>
        <Menu></Menu>
        <Route exact path='/' component={Body}/>
        <Route exact path='/table' component={Table}/>
        <Route exact path='/chat' component={Chat}/>
        <Notification></Notification>
    </div>
  );
}

export default App;
