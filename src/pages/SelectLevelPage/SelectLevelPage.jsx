import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useState } from "react";
import LeaderBordLink from "../../components/LeaderBordLink/LeaderBordLink";
import { Button } from "../../components/Button/Button";

export function SelectLevelPage() {
  const [mode, setMode] = useState(false);
  const [lsName, setLsName] = useState(localStorage.name)

  const [name, setName] =useState()

  function chengeCheckbox() {
    setMode(!mode);
  }

  function addName () {
    if (name !== "" && name !== undefined) {
      localStorage.name = name
      setLsName(name)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.nameBox}>
        <span className={styles.name}>{localStorage?.name}</span>
      </div>
      <div className={styles.modal}>

        {
          lsName ? (
            <>
              <h1 className={styles.title}>Выбери сложность </h1>

              <a className={styles.linkName} onClick={() => {
                localStorage.name = ""
                setName(null)
                setLsName(null)
              }}>
                Сменить имя
              </a >
            <ul className={styles.levels}>
              <li className={styles.level}>
                <Link className={styles.levelLink} to={`/game/3_${mode}`}>
                  1
                </Link>
              </li>
              <li className={styles.level}>
                <Link className={styles.levelLink} to={`/game/6_${mode}`}>
                  2
                </Link>
              </li>
              <li className={styles.level}>
                <Link className={styles.levelLink} to={`/game/9_${mode}`}>
                  3
                </Link>
              </li>
            </ul>
              <div className="toggle-pill-dark">
                <input type="checkbox" id="pill4" name="check" checked={mode} onChange={chengeCheckbox}/>
                <label htmlFor="pill4"></label>
              </div>

              {mode ? <p className={styles.mode}>Легкий режим (3 жизни)</p> : <p className={styles.noMode}>Стандартная игра</p> }

            </>
          ) : (
            <>
              <h1 className={styles.title}>Введите имя</h1>
              <input type="text" className={styles.input} onChange={(e) => {
                setName(e.target.value)
              }}/>
              <Button className={styles.rpg} style={{borderRadius: '50px', background: '#004980'}}  onClick={addName}>Запомнить меня</Button>
            </>
          )
        }
        <LeaderBordLink>
          Перейти к лидерборду
        </LeaderBordLink>
      </div>
    </div>
  );
}
