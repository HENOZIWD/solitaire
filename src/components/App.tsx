import React, { useEffect, useState } from 'react';
import styles from '../styles/App.module.css';

interface ICardPosition {
  x: number;
  y: number;
  isClicked: boolean;
  deckIndex: number;
}

const App = () => {

  const baseFontSizeString = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const baseFontSize = +baseFontSizeString.slice(0, baseFontSizeString.indexOf('px'));
  const cardWidth = baseFontSize * 5;
  const cardHeight = baseFontSize * 7;
  const deckWidth = baseFontSize * 6;
  const deckHeight = baseFontSize * 8;
  const [cardDatas, setCardDatas] = useState<ICardPosition[]>([
    { x: 100, y: 500, isClicked: false, deckIndex: -1 },
    { x: 200, y: 500, isClicked: false, deckIndex: -1 },
    { x: 300, y: 500, isClicked: false, deckIndex: -1 },
    { x: 400, y: 500, isClicked: false, deckIndex: -1 },
    { x: 500, y: 500, isClicked: false, deckIndex: -1 },
  ]);
  const [zIndex, setZIndex] = useState<number>(1);
  const [deck, setDeck] = useState<number[][]>(Array.from({ length: 7 }, () => []));
  const [focusedDeck, setFocusedDeck] = useState<number>(-1);

  useEffect(() => {
    console.log(deck);
  }, [deck])

  const checkBoundary = (val: number, min: number, max: number, pad: number) => {
    
    if (val < min + pad) {
      return min + pad;
    }
    else if (max - pad < val) {
      return max - pad;
    }

    return val;
  }

  const checkDeck = (prevDeckIndex: number, x: number, y: number) => {
    let deckIndex = -1;
    for (let i = 0; i < deck.length; i++) {
      if (i !== prevDeckIndex) {
        const currentDeckLeft = 100 + i * 100;
        const currentDeckTop = 100 + deck[i].length * baseFontSize * 2;
        if (currentDeckLeft < x && x < currentDeckLeft + deckWidth &&
            currentDeckTop < y && y < currentDeckTop + deckHeight) {
          
          setFocusedDeck(i);
          deckIndex = i;
          break;
        }
      }
    }

    return deckIndex;
  }

  const stackToDeck = (cardIndex: number, prevDeckIndex: number, nextDeckIndex: number) => {
    const newDeck = deck.slice();
    if (prevDeckIndex !== -1) {
      newDeck[prevDeckIndex] = newDeck[prevDeckIndex].filter(d => d !== cardIndex);
    }
    newDeck[nextDeckIndex].push(cardIndex);
    setDeck(newDeck);
  }

  return (
    <>
    <div
      className={styles.board}
    >
      {deck.map((d, i) => (
        <div
          key={i}
          className={styles.deck}
          style={{
            left: 100 + i * 100,
            top: 100,
            border: `${focusedDeck === i ? 1 : 0}px solid yellow`
          }}
        />
      ))}
      {cardDatas.map((card, i) => (
        <div
          key={i}
          className={styles.card}
          style={{ transform: `translateX(${card.x}px) translateY(${card.y}px) scale(${card.isClicked ? 0.9 : 1})` }}
          onMouseDown={(mouseDownEvent) => {
            mouseDownEvent.preventDefault();
            mouseDownEvent.stopPropagation();
            let deckIndex = cardDatas[i].deckIndex;

            let prevX = card.x;
            let prevY = card.y;
            checkDeck(deckIndex, mouseDownEvent.pageX, mouseDownEvent.pageY)

            const mouseMove = (mouseMoveEvent: MouseEvent) => {
              const newCardDatas = cardDatas.slice();
              const nextX = checkBoundary(mouseMoveEvent.pageX - cardWidth / 2, 0, window.innerWidth - cardWidth, baseFontSize);
              const nextY = checkBoundary(mouseMoveEvent.pageY - baseFontSize * 2, 0, window.innerHeight - cardHeight, baseFontSize);

              if (checkDeck(deckIndex, mouseMoveEvent.pageX, mouseMoveEvent.pageY) === -1) {
                setFocusedDeck(-1);
              }
              newCardDatas[i] = {
                ...newCardDatas[i],
                x: nextX,
                y: nextY,
                isClicked: true,
              };
              setCardDatas(newCardDatas);
            }

            const mouseUp = (mouseUpEvent: MouseEvent) => {
              const moveResult = checkDeck(deckIndex, mouseUpEvent.pageX, mouseUpEvent.pageY);
              if (moveResult !== -1) {
                prevX = 100 + moveResult * 100 + baseFontSize / 2;
                prevY = 100 + baseFontSize / 2 + deck[moveResult].length * baseFontSize * 2;
                stackToDeck(i, deckIndex, moveResult);
                deckIndex = moveResult;
              }
              const newCardDatas = cardDatas.slice();
              newCardDatas[i] = {
                x: prevX,
                y: prevY,
                isClicked: false,
                deckIndex: deckIndex,
              };
              setCardDatas(newCardDatas);
              setFocusedDeck(-1);
              document.removeEventListener('mousemove', mouseMove);
            }

            const newCardDatas = cardDatas.slice();
            newCardDatas[i] = {
              ...newCardDatas[i],
              x: checkBoundary(mouseDownEvent.pageX - cardWidth / 2, 0, window.innerWidth - cardWidth, baseFontSize),
              y: checkBoundary(mouseDownEvent.pageY - baseFontSize * 2, 0, window.innerHeight - cardHeight, baseFontSize),
              isClicked: true,
            };
            setCardDatas(newCardDatas);
            mouseDownEvent.currentTarget.style.zIndex = zIndex.toString();
            setZIndex(z => z + 1);
            // console.log(zIndex);
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp, { once: true });
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
    </>
  );
}

export default App;
