import styles from 'css/menu/styles.module.scss';
import { Link, useLocation } from 'react-router-dom';

export default function Menu() {
    const { pathname } = useLocation();
    console.log(pathname);

    return <div className={`${styles['menu']} container`}>

      <div className="row">
        <div className="col">
          <div className={styles['menu__row']}>
            <div className={`${styles['menu__row__item']}`}>
              <Link to='/'>
                <div className={`${pathname === '/' ? styles['selected'] : ''}`}>
                  Иерархия
                </div>
              </Link>
            </div>
            <div className={`${styles['menu__row__item']} ${pathname === '/table' ? styles['menu__row__item_selected'] : ''}`}>
              <Link to='/table'>
                <div className={`${pathname === '/table' ? styles['selected'] : ''}`}>
                  Таблица
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>;
}