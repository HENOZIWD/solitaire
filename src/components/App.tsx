import React from 'react';
import Card from './card';
import styles from '../styles/App.module.css';

const App = () => {

  const baseFontSize = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const boardWidth = +(baseFontSize.slice(0, baseFontSize.indexOf('px'))) * 50;
  const boardHeight = +(baseFontSize.slice(0, baseFontSize.indexOf('px'))) * 30;

  return (
    <>
    <div className={styles.container}>
      <div className={styles.board}>
        <div className={styles.cell} />
        <Card
          boardWidth={boardWidth}
          boardHeight={boardHeight}
        />
        <Card
          boardWidth={boardWidth}
          boardHeight={boardHeight}
        />
        <Card
          boardWidth={boardWidth}
          boardHeight={boardHeight}
        />
      </div>
    </div>
    </>
  );
}

export default App;
