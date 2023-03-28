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
  const [cardPositions, setCardPositions] = useState<ICardPosition[]>([
    { x: 0, y: 0 },
    { x: baseFontSize, y: 0 },
    { x: baseFontSize * 2, y: 0 },
    { x: baseFontSize * 3, y: 0 },
    { x: baseFontSize * 4, y: 0 },
    { x: baseFontSize * 5, y: 0 },
    { x: baseFontSize * 6, y: 0 },
    { x: baseFontSize * 7, y: 0 },
  ]);

  const movePosition = (i: number, x: number, y: number) => {
    const newCardPositions = cardPositions.slice();
    newCardPositions[i] = { x: x, y: y };
    setCardPositions(newCardPositions);
  };

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
          />
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
