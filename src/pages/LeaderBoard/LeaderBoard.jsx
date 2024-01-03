import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderBoard.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Leader from "../../components/Leader/Leader";
import BASE_URL from "../../api";

function LeaderBoard(props) {
  const [leaderList, setLeaderList] = useState(null);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState(false);


  useEffect(() => {
    axios.get(BASE_URL).then(
      leaderListJson => {
        leaderListJson = leaderListJson.data.leaders;
        const data = leaderListJson?.sort((a, b) => a.time > b.time ? 1 : -1);
        setLeaderList(data);
      }
    ).catch(error => setError(error.message));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.contentBlock}>
        <div className={styles.nav}>
          <h2 className={styles.label}>Лидерборд</h2>
          <Link to="/">
            <Button>Начать игру</Button>
          </Link>
        </div>
        <div className={styles.boxLeader}>
          <div className={styles.leader}>
            <p>Позиция</p>
            <p>Пользователь</p>
            <p>Достижения</p>
            <p>Время</p>
          </div>
          {leaderList?.map((leader, index) => {
            return <Leader
              key={leader.id}
              name={leader.name}
              position={index + 1}
              time={leader.time}
              achievements={leader?.achievements}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
            />;
          })}
        </div>
        <p className={styles.error}>{error}</p>
      </div>
    </div>
  );
}

export default LeaderBoard;