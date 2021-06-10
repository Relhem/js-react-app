import styles from 'css/utils/styles.module.scss';

export default function Loader() {
    return <div className={styles['lds-roller']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>;
}