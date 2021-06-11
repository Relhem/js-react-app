import React from 'react';
import { Route } from 'react-router';
import './css/index.scss';
import Body from './views/body/Body';
import Header from './views/header/Header';
import Menu from './views/menu/Menu';
import Notification from './views/notifications/Notification';
import Table from './views/table/Table';

function App(props) {
  console.log('pr', props);
  return (
    <div className="app">
        <Header></Header>
        <Menu></Menu>
        <Route exact path='/' component={Body}/>
        <Route exact path='/table' component={Table}/>
        <Notification></Notification>
    </div>
  );
}

export default App;
