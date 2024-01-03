import React from "react";
import styles from "./PopupBg.module.css";

function PopupBg({ children }) {
  return (
    <div className={styles.popupBg}>
      {children}
    </div>
  );
}

export default PopupBg;