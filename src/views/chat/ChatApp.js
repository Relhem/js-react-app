import { useDispatch, useSelector } from "react-redux";
import styles from 'css/chat/styles.module.scss';
import { addMessage, selectMessages, selectUsers } from "store/chatSlice"

import userSvg from 'assets/user.svg';
import { useEffect, useState } from "react";
import { wsClient, wsHandlers } from "websocket/client";

export default function ChartApp() {
    const [inputMsg, setInputMsg] = useState('');
    const dispatch = useDispatch();

    const users = useSelector(selectUsers);
    const messages = useSelector(selectMessages);

    const sendMessage = () => {
      wsClient.send({ action: 'SEND_MESSAGE', value: { message: inputMsg }});
      setInputMsg('');
    };

    useEffect(() => {
      wsHandlers.setHandler({ id: 'CHATAPP.RECIEVE_MESSAGE', handler: (msg) => {
        const message = wsClient.parseResponse(msg);
        if (message.action === 'MESSAGE_FROM_SERVER') {
          const messageObject = message.value;
          dispatch(addMessage({ messageObject }));
        }
      }});
    }, [false]);

    return <div>

      <div className="container">
          <div className="row">
            <div className="col-3">
              {
                users.map((username) => {
                  return <div key={username} className={styles['chatapp-user-item']}>
                    <img src={userSvg} className={styles['chatapp-user-icon']}></img>
                    {username}
                  </div>
                })
              }
            </div>
            <div className="col-9">
              <div className={styles['chatapp-messages-block']}>
                {
                  messages.map((message) => {
                    return <div key={message.messageId} className={styles['chatapp-message-item']}>
                      {
                        message.isSystem ? '' : <div>
                          <b>{message.sentBy}</b>: {message.message}
                        </div>
                      }
                    </div>
                  })
                }
              </div>
              <div className={`d-flex ${styles['chatapp-input']}`}>
                <div className="input-group mt-3">
                  <input
                  value={inputMsg}
                  onChange={(e) => {setInputMsg(e.target.value)}}
                  type="text" className="form-control" placeholder="Enter message..."/>
                </div>
                <div className={styles['chatapp-send-button']}>
                  <button
                    onClick={() => { sendMessage() }}
                    className='btn btn-primary'>Send</button>
                </div>
              </div>
            </div>
            
          </div>
      </div>

    </div>
}