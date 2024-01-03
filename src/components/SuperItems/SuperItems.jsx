import React, { useState } from "react";
import Popup from "../Popup/Popup";
import styles from "./SuperItems.module.css";
import superItem from "../SuperItem/SuperItem";
import SuperItem from "../SuperItem/SuperItem";
import eye from "./images/eye.svg";
import s from "./images/cardsSuper.svg";

function SuperItems({ setSuperpowers, superpowers }) {
  // всплывающее окно
  const [popup, setPopup] = useState(null);

  const superSill = [
    {
      id: 1,
      img: eye,
      title: "Прозрение",
      text: "На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.",
      hover: true
    },
    {
      id: 2,
      img: s,
      title: "Алохомора",
      text: "Открывается случайная пара карт.",
      hover: true
    }
  ];
  return (
    <div className={styles.superBox}>
      {superSill.map(superItemElement => {
        return <SuperItem
          key={superItemElement.id}
          id={superItemElement.id}
          img={superItemElement.img}
          text={superItemElement.text}
          title={superItemElement.title}
          hover={superItemElement.hover}
          popup={popup}
          setPopup={setPopup}
          superpowers={superpowers}
          setSuperpowers={setSuperpowers}
        />;
      })}
    </div>
  );
}

export default SuperItems;