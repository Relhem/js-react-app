import 'css/notifications/styles.scss';
import { useSelector } from 'react-redux';
import * as notificationSlice from 'store/notificationSlice.js';

export default function Notification() {

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
    </div>
}