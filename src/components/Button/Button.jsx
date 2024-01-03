import styles from "./Button.module.css";

export function Button({ children, onClick, style }) {
  return (
    <button onClick={onClick} className={styles.button} style={style}>
      {children}
    </button>
  );
}
