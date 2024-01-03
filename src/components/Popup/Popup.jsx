import React from "react";
import styles from "./Popup.module.css"
function Popup({text, title,  style}) {
  return (
      <div className={styles.popup} style={style}>
        <p>{title}</p>
        {text}
      </div>
  );
}

export default Popup;