import styles from 'css/chat/styles.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { wsClient, wsHandlers } from 'websocket/client';

import { setIsAuthenticated, setUsername as setUsernameInStore, setUsers } from 'store/chatSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const handleEnter = () => {
    wsClient.send({ action: 'USER_ENTER', value: { username } });
  };
  
  useEffect(() => {
    wsHandlers.setHandler({ id: 'USER_ENTER_SUCCESS', handler: (msg) => {
      const message = wsClient.parseResponse(msg);
      if (message.action === 'USER_ENTER_SUCCESS') {
        dispatch(setUsernameInStore({ username: message.value.username }));
        dispatch(setUsers({ users: message.value.users }));
        dispatch(setIsAuthenticated({ isAuthenticated: true }));
        console.log(message.value);
      }
    }});
  });

  return <div>
    <div className="form-group text-center">
      <div className={`${styles['login-label']} mb-3`}>Имя пользователя</div>
      <input
      value={username}
      onChange={(e) => {
        setUsername(e.target.value);
      }}
      className={`form-control ${username && username.length < 5 ? 'is-invalid' : ''}`} placeholder="Введите имя..."/>
      <div className="invalid-feedback">Name must contain at least 5 characters</div>
    </div>

    <div className={`text-center ${styles['login-button']}`}>
      <button className="btn btn-primary"
      onClick={ () => handleEnter() }
      disabled={username == '' || username.length < 5}
      style={{minWidth: '200px'}}>Войти</button>
    </div>
  </div>
}