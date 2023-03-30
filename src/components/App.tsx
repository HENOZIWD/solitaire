import React, { useState } from 'react';
import Card from './card';
import styles from '../styles/App.module.css';

export interface ICardPosition {
  x: number;
  y: number;
}

const App = () => {

  const baseFontSizeString = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const baseFontSize = +baseFontSizeString.slice(0, baseFontSizeString.indexOf('px'));
  const boardWidth = baseFontSize * 50;
  const boardHeight = baseFontSize * 30;
  const cardWidth = baseFontSize * 5;
  const cardHeight = baseFontSize * 5;
  const gap = baseFontSize;
  const [cardPositions, setCardPositions] = useState<ICardPosition[]>([
    { x: 0 + gap / 2, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 2, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 4, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 6, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 8, y: 0 + gap / 2 },
  ]);
  const [realCardPositions, setRealCardPositions] = useState<ICardPosition[]>([
    { x: 0 + gap / 2, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 2, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 4, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 6, y: 0 + gap / 2 },
    { x: 0 + gap / 2 + cardWidth * 8, y: 0 + gap / 2 }, 
  ]);
  // const [cardStacks, setCardStacks] = useState<number[][]>(Array.from({ length: 5 }, () => []));

  // const stackCard = (i: number) => {

  // }

  const checkCardBoundary = (i: number, pos: ICardPosition) => {
    let newPos = {...pos};
    let isStacked = false;


    for (let cardIdx = 0; cardIdx < i; cardIdx++) {
      if (cardIdx !== i &&
        cardPositions[cardIdx].x - gap < newPos.x &&
        newPos.x < cardPositions[cardIdx].x + gap &&
        cardPositions[cardIdx].y + baseFontSize * 3 / 2 - gap < newPos.y &&
        newPos.y < cardPositions[cardIdx].y + baseFontSize * 3 / 2 + gap) {

          newPos = { x: cardPositions[cardIdx].x, y: cardPositions[cardIdx].y + baseFontSize * 3 / 2};
          isStacked = true;
          break;
      }
    }

    return { isStacked: isStacked, newPos: newPos };
  }

  const checkBoardBoundary = (i: number, pos: ICardPosition) => {
    let newPos = {...pos};
    if (newPos.x < 0 + gap) {
      newPos.x = 0 + gap / 2;
    }
    else if (boardWidth - cardWidth - gap < newPos.x) {
      newPos.x = boardWidth - cardWidth - gap / 2;
    }

    if (newPos.y < 0 + gap) {
      newPos.y = 0 + gap / 2;
    }
    else if (boardHeight - cardHeight - gap < newPos.y) {
      newPos.y = boardHeight - cardHeight - gap / 2;
    }

    return newPos;
  }

  const checkBoundary = (i: number, pos: ICardPosition) => {
    let newPos = pos;

    newPos = checkBoardBoundary(i, newPos);
    newPos = checkCardBoundary(i, newPos).newPos;

    return newPos;
  }

  const movePosition = (i: number, newPos: ICardPosition) => {
    const newCardPositions = cardPositions.slice();
    newCardPositions[i] = checkBoundary(i, newPos);
    setCardPositions(newCardPositions);
  }

  const moveRealPosition = (i: number, newPos: ICardPosition) => {
    const newRealCardPositions = realCardPositions.slice();
    newRealCardPositions[i] = {...newPos};
    setRealCardPositions(newRealCardPositions);
    setCardPositions(newRealCardPositions);
  }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.board}>
        {cardPositions.map((c, i) => (
          <Card
            key={i}
            cardIndex={i}
            pos={cardPositions[i]}
            realPos={realCardPositions[i]}
            boardWidth={boardWidth}
            boardHeight={boardHeight}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            movePosition={movePosition}
            moveRealPosition={moveRealPosition}
            checkCardBoundary={checkCardBoundary}
          />
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
