import hpImg from "./images/hp.svg";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import BASE_URL from "../../api";
import SuperItems from "../SuperItems/SuperItems";


// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

// задержка для анимаций
const delay = 500;

function validRandom(openCards) {
  const randomInt = Math.round(Math.random() * 10);
  if (!openCards?.includes(randomInt)) {
    return randomInt;
  } else {
    validRandom(openCards);
  }
}

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5, mode = false }) {
  // Уровень сложности
  const [complexity] = useState(pairsCount === 9 ? 1 : null);
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Последняя карта
  const [endCard, setEndCard] = useState(null);
  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);
  // Жизни
  const [hp, setHp] = useState(() => mode ? 3 : null);
  // Суперсилы
  const [superpowers, setSuperpowers] = useState([]);
  // Ачивки
  const [achievement, setAchievement] = useState(2);

  useEffect(() => {
      if (status === STATUS_WON) {
        fetch(BASE_URL, {
            method: "POST",
            body: JSON.stringify({
              name: localStorage.name,
              time: getTimerValue(gameStartDate, gameEndDate).minutes * 60 + getTimerValue(gameStartDate, gameEndDate).seconds,
              achievements: () => {
                if (complexity && achievement) {
                  return [complexity, achievement]
                } else if (complexity && !achievement){
                  return [complexity]
                } else if (!complexity && achievement){
                  return [achievement]
                } else {
                  return []
                }
              }
            })
          }
        ).then(r => {
          console.log(r);
        }).catch(error => {
          console.log(error.message);
        });
      }
    },
    [status]
  );

  useEffect(() => {

    if (superpowers?.includes(1)) {
      console.log(superpowers, "Используется прозрение");
      const oldCards = [];
      const newCards = cards.map((card, index) => {
        if (card.open) {
          oldCards.push(index);
        }
        card.open = true;
        return card;
      });
      setCards(newCards);
      const pauseTime = new Date();
      setGameEndDate(pauseTime);
      setTimeout(() => {
        setGameStartDate(prevStartDate => {
          const timePaused = new Date().getTime() - pauseTime.getTime();
          const newStartDate = new Date(prevStartDate.getTime() + timePaused);
          setGameEndDate(null);
          return newStartDate;
        });
        const newCards = cards.map((card, index) => {
          if (oldCards?.includes(index)) {
            card.open = true;
            return card;
          } else {
            card.open = false;
            return card;
          }
        });
        setCards(newCards);
      }, 5000);
    }

    if (superpowers?.includes(2)) {
      console.log(superpowers, "Используется Алохомора");
      const openCards = [];
      cards.forEach(card => {
        if (card.open) {
          openCards.push(card);
        }
      });
      if (openCards?.length % 2 !== 0 && endCard) {
        const newCards = cards.map(card => {
          if (card.rank === endCard.rank && card.suit === endCard.suit && card.id !== endCard.id) {
            card.open = true;
            return card;
          }
          return card;
        });
        setCards(newCards);
      } else {
        const random = validRandom();
        const randomCard = cards[random];
        const newCards = cards.map(card => {
          if (card.rank === randomCard.rank && card.suit === randomCard.suit) {
            card.open = true;
            return card;
          }
          return card;
        });
        setCards(newCards);
      }
      const isPlayerWon = cards.every(card => card.open);

      // Победа - все карты на поле открыты
      if (isPlayerWon) {
        finishGame(STATUS_WON);
        return;
      }
    }

    if (superpowers?.length !== 0) {
      setAchievement(null);
    }
  }, [superpowers]);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    setSuperpowers([]);
    setAchievement(2);
    mode && setHp(3);
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    setEndCard(clickedCard);
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары

    if (playerLost) {
      if (mode) {
        if (hp === 1) {
          setTimeout(() => {
            finishGame(STATUS_LOST);
          }, delay);
          return;
        } else {
          setHp(() => hp - 1);
          console.log(hp);
          // Игровое поле после открытия неверной карты
          setTimeout(() => {
            const nextCards = cards.map(card => {
              if (card.id !== clickedCard.id) {
                return card;
              }

              return {
                ...card,
                open: false
              };
            });
            setCards(nextCards);
          }, delay);

          return;
        }
      } else {
        finishGame(STATUS_LOST);
        return;
      }
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div className={styles.title}>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS && <SuperItems setSuperpowers={setSuperpowers} superpowers={superpowers} />}
        <div className={styles.hpBox}>
          {(status === STATUS_IN_PROGRESS) && mode ? Array.from(
            Array(hp).keys())
            .map(i => <img
              key={i}
              className={styles.hp}
              src={hpImg}
              alt="Жизнь" />) : null
          }
        </div>
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
