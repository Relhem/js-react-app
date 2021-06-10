import 'css/notifications/styles.scss';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as notificationSlice from 'store/notificationSlice.js';

export default function Notification() {

    const text = useSelector(notificationSlice.selectText);
    const usedClass = useSelector(notificationSlice.usedClass);
    const notificationIsVisible = useSelector(notificationSlice.selectNotificationVisibility);
    const notificationText = useSelector(notificationSlice.selectNotificationText);
    const notificationUsedClasses = useSelector(notificationSlice.selectNotificationUsedClasses);

    const notificationVisibleClass = !notificationIsVisible ? 'custom-notification_invisible' : '';
    return <div>
      {
        <div
          className={`custom-notification ${notificationVisibleClass} ${notificationUsedClasses}`}> 
          <div>
            { notificationText }
          </div>
        </div>
      }

      {
        <div className={`custom-alert container ${text === '' || text === 'none' ? 'invisible' : 'visible'}`}>
          <div className={`alert-width alert ${usedClass}`} role="alert">
                {text}
          </div>
        </div>
      }
      
    </div>
    
}