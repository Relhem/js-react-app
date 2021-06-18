import styles from 'css/menu/styles.module.scss';
import { Link, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { wsClient, wsHandlers } from 'websocket/client';
import { useEffect, useState } from 'react';

function WebSocketBar() {
  const [barValue, setBarValue] = useState(0);

  const sendPosition = ({ position }) => {
    if (wsClient.client.readyState === wsClient.client.OPEN) {
      wsClient.client.send(JSON.stringify({action: 'SEND_VALUE', value: position }));
    }
  };

  wsHandlers.setHandler({ id: 'MENU.SET_VALUE', handler: (msg) => {
    const message = wsClient.parseResponse(msg);
    if (message.action === 'SET_VALUE') {
      setBarValue(message.value);
    }
  }});

  useEffect(() => {
    sendPosition({ position: barValue })
  }, [barValue]);

  return <div className="container mb-3">
    <input
    value={barValue}
    onChange={(e) => { setBarValue(e.target.value); }}
    type="range" className="form-range" id="customRange1"/>
  </div>
}
export default function Menu() {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    console.log(pathname);

    return <div>
      <div className={`${styles['menu']} container`}>
        <div className="row">
          <div className="col">
            <div className={styles['menu__row']}>
              <div className={`${styles['menu__row__item']}`}>
                <Link to='/'>
                  <div className={`${pathname === '/' ? styles['selected'] : ''}`}>
                    {t('Hierarchy')}
                  </div>
                </Link>
              </div>
              <div className={`${styles['menu__row__item']} ${pathname === '/table' ? styles['menu__row__item_selected'] : ''}`}>
                <Link to='/table'>
                  <div className={`${pathname === '/table' ? styles['selected'] : ''}`}>
                    {t('Table')}
                  </div>
                </Link>
              </div>
              <div className={`${styles['menu__row__item']} ${pathname === '/chat' ? styles['menu__row__item_selected'] : ''}`}>
                <Link to='/chat'>
                  <div className={`${pathname === '/chat' ? styles['selected'] : ''}`}>
                    {t('Chat')}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WebSocketBar/>
    </div>;
}