import React, { useEffect, useRef, useState } from "react";
import styles from "./Leader.module.css";
import { useClose } from "../../hooks/useClose";


function Leader({ name, time, position, achievements, setContextMenu, contextMenu }) {
  const [left, setLeft] = useState(null);
  const [text, setText] = useState(null);
  const [hard] = useState(achievements?.includes(1));
  const [magic] = useState(achievements?.includes(2));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const validTime = [
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0")
  ].join(":");

  function mouseEnter(leftIndent) {
    setLeft(leftIndent);
    setContextMenu(position);
  }

  function mouseLeave() {
    setContextMenu(null);
  }

  return (
    <div className={styles.leader}>
      <p className={styles.position}>#{position}</p>
      <p className={styles.name}>{name}</p>
      <div className={styles.box}>
        {contextMenu === position && <div className={styles.popup} style={{left: `${left}px`}}>{text}</div>}
        {hard ? <img
            src="./hard.svg"
            alt="hard achievements"
            onMouseEnter={() => {
              setText('Игра пройдена в сложном режиме')
              mouseEnter(25);
            }}
            onMouseLeave={mouseLeave}
          />
          :
          <img
            src="./no-hard.svg"
            alt="hard achievements"
            onMouseEnter={() => {
              setText('Игра пройдена в сложном режиме')
              mouseEnter(25);
            }}
            onMouseLeave={mouseLeave}
          />
        }
        {magic ? <img
            src="./magic.svg"
            alt="magic achievements"
            onMouseEnter={() => {
              setText('Игра пройдена без супер-сил')
              mouseEnter(55);
            }}
            onMouseLeave={mouseLeave}
          />
          :
          <img
            src="./no-magic.svg"
            alt="magic achievements"
            onMouseEnter={() => {
              setText('Игра пройдена без супер-сил')
              mouseEnter(55)
            }}
            onMouseLeave={mouseLeave}
          />}
      </div>
      <p className={styles.time}>{validTime}</p>
    </div>
  );
}

export default Leader;