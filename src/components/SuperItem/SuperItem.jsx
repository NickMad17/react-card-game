import Popup from "../Popup/Popup";
import styles from "./SuperItem.module.css";
import PopupBg from "../PopupBg/PopupBg";
import { useState } from "react";

function SuperItem({ popup, setPopup, id, text , img, title, hover, setSuperpowers, superpowers}) {
  const [hoverState, setHoverState] = useState(hover)
  const [loadingState, setLoadingState] = useState(null)
  const [disabled, setDisabled] = useState(null)
  const addPopup = () => {
    if (hoverState) {
      popup !== id ? setPopup(id) : setPopup(null);
    } else {
      setPopup(null)
    }
  }

  const useClick = () => {
    if (!disabled && superpowers.length === 0) {
      setSuperpowers([
        ...superpowers,
        id
      ])
      setLoadingState(true)
      setPopup(null)
      hover = false
      setHoverState(false)
      setTimeout(() => {
        setSuperpowers([])
        setLoadingState(false)
        setDisabled(true)
      }, 5000)

    }
  }

  return (
    <>
    <div
      className={`${styles.superItem}  ${popup === id ? styles.zIndex : ""}`}
      onMouseEnter={addPopup}
      onMouseLeave={addPopup}
      onClick={useClick}
    >
      {popup === id && <Popup text={text} title={title} style={{
        left: '-80px',
        top: '65px',
        position: 'absolute'
      }}/>}
      <img src={img} alt="Кнопка" />
      <div className={`${disabled ? styles.disabled: ""} ${loadingState ? styles.load : ""}`}></div>
    </div>
      {popup === id && <PopupBg/>}
    </>
  );
}

export default SuperItem;