import React, { useState } from 'react';
import Card from './card';
import styles from '../styles/App.module.css';

export interface ICardPosition {
  x: number;
  y: number;
}

const App = () => {

  const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  const baseFontSizeString = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const baseFontSize = +baseFontSizeString.slice(0, baseFontSizeString.indexOf('px'));
  const boardWidth = baseFontSize * 50;
  const boardHeight = baseFontSize * 30;
  const [cardPositions, setCardPositions] = useState<ICardPosition[]>([
    { x: getRandomArbitrary(0, boardWidth - baseFontSize * 5), y: getRandomArbitrary(0, boardHeight - baseFontSize * 5) },
    { x: getRandomArbitrary(0, boardWidth - baseFontSize * 5), y: getRandomArbitrary(0, boardHeight - baseFontSize * 5) },
    { x: getRandomArbitrary(0, boardWidth - baseFontSize * 5), y: getRandomArbitrary(0, boardHeight - baseFontSize * 5) },
    { x: getRandomArbitrary(0, boardWidth - baseFontSize * 5), y: getRandomArbitrary(0, boardHeight - baseFontSize * 5) },
    { x: getRandomArbitrary(0, boardWidth - baseFontSize * 5), y: getRandomArbitrary(0, boardHeight - baseFontSize * 5) },
    { x: getRandomArbitrary(0, boardWidth - baseFontSize * 5), y: getRandomArbitrary(0, boardHeight - baseFontSize * 5) },
  ]);
  const [stack, setStack] = useState<Array<number>>([0]);

  const pushStack = (i: number) => {
    if (stack[stack.length - 1] + 1 === i) {
      const newStack = stack.slice();
      newStack.push(i);
      setStack(newStack);
    }
  }

  const popStack = (i: number) => {
    if (stack[stack.length - 1] === i) {
      const newStack = stack.slice();
      newStack.pop();
      setStack(newStack);
    }
  }

  const movePosition = (i: number, x: number, y: number) => {
    const newCardPositions = cardPositions.slice();
    newCardPositions[i] = { x: x, y: y };
    setCardPositions(newCardPositions);
  }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.board}>
        <div className={styles.cell} />
        {cardPositions.map((c, i) => (
          <Card
            key={i}
            cardIndex={i}
            xPos={cardPositions[i].x}
            yPos={cardPositions[i].y}
            boardWidth={boardWidth}
            boardHeight={boardHeight}
            movePosition={movePosition}
            pushStack={pushStack}
            popStack={popStack}
          />
        ))}
      </div>
      {stack.map((num, index) => (
        <div key={index}>
          {num}
        </div>
      ))}
    </div>
    </>
  );
}

export default App;
