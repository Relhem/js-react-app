import styles from 'css/chat/styles.module.scss';
import Login from './Login';
import ChatApp from './ChatApp';

import { selectIsAuthenticated } from 'store/chatSlice';
import { useSelector } from 'react-redux';


export default function Chat() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return <div>
      {
        !isAuthenticated ? 
        <div className={`container mt-3 ${styles['login-container']}`}>
          <Login></Login>
        </div> : 
        <div className={`container mt-3 ${styles['chat-container']}`}> 
            <ChatApp></ChatApp>
        </div>
      }
  </div>
}