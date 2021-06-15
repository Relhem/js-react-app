import styles from 'css/utils/styles.module.scss';

export default function Loader(props) {
    return <div style={props.styles} className={styles['lds-roller']}>
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