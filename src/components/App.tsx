import React, { useEffect, useState } from 'react';
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
  const stackGap = baseFontSize * 3 / 2;
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
  const [cardStack, setCardStack] = useState<number[]>(Array.from({ length: cardPositions.length }, (v, i) => i));

  useEffect(() => {
    console.log(cardStack);
  }, [cardStack])

  const find = (i: number): number => {
    if (cardStack[i] === i) {
      return i;
    }
    // const newStack = cardStack.slice();
    // const parent = find(cardStack[i]);
    // cardStack[i] = parent;
    // setCardStack(newStack);

    return find(cardStack[i]);
  }

  const stackCard = (a: number, b: number) => {
    // const aParent = find(a);

    const newStack = cardStack.slice();
    newStack[b] = a;
    setCardStack(newStack);
  }

  const checkCardBoundary = (i: number, pos: ICardPosition) => {
    let newPos = {...pos};
    let isStacked = false;
    let cardIdx = 0;

    while (cardIdx < i) {
      if (cardIdx !== i &&
        cardPositions[cardIdx].x - gap < newPos.x &&
        newPos.x < cardPositions[cardIdx].x + gap &&
        cardPositions[cardIdx].y + stackGap - gap < newPos.y &&
        newPos.y < cardPositions[cardIdx].y + stackGap + gap) {

          newPos = { x: cardPositions[cardIdx].x, y: cardPositions[cardIdx].y + stackGap};
          isStacked = true;
          break;
      }

      cardIdx++;
    }

    return {
      newPos: newPos,
      isStacked: isStacked,
      stackIdx: cardIdx,
    };
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
    const parent = find(i);
    const newCardPositions = cardPositions.slice();
    newCardPositions[i] = checkBoundary(i, newPos);
    let count = 1;
    for (let index = i + 1; index < cardPositions.length; index++) {
      if (find(index) === parent) {
        newCardPositions[index] = { x: newCardPositions[i].x, y: newCardPositions[i].y + stackGap * count };
        count++;
      }
    }
    setCardPositions(newCardPositions);
  }

  const moveRealPosition = (i: number, newPos: ICardPosition) => {
    const parent = find(i);
    const newRealCardPositions = realCardPositions.slice();
    newRealCardPositions[i] = {...newPos};
    for (let index = i + 1; index < realCardPositions.length; index++) {
      if (find(index) === parent) {
        newRealCardPositions[index] = { x: newPos.x, y: newPos.y + stackGap * (index - i) };
      }
    }
    setRealCardPositions(newRealCardPositions);
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
            stackCard={stackCard}
          />
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
