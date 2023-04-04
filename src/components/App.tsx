import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/App.module.css';
import Card from './card';

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
  const deckLeft = 200;
  const deckTop = 250;
  const deckWidth = baseFontSize * 6;
  const deckHeight = baseFontSize * 8;

  const [cardDatas, setCardDatas] = useState<ICardPosition[]>([
    { x: 100, y: 500, isClicked: false, deckIndex: -1 },
    { x: 200, y: 500, isClicked: false, deckIndex: -1 },
    { x: 300, y: 500, isClicked: false, deckIndex: -1 },
    { x: 400, y: 500, isClicked: false, deckIndex: -1 },
    { x: 500, y: 500, isClicked: false, deckIndex: -1 },
    { x: 600, y: 500, isClicked: false, deckIndex: -1 },
    { x: 700, y: 500, isClicked: false, deckIndex: -1 },
    { x: 800, y: 500, isClicked: false, deckIndex: -1 },
  ]);
  const [zIndex, setZIndex] = useState<number>(1);
  const [deck, setDeck] = useState<number[][]>(Array.from({ length: 7 }, () => []));
  const [focusedDeck, setFocusedDeck] = useState<number>(-1);
  const [stock, setStock] = useState<number[]>([
    5, 6, 7
  ]);
  const [topDeck, setTopDeck] = useState<number[][]>(Array.from({ length: 4 }, () => []));

  const cardRefs = useRef<HTMLDivElement[] | null[]>([]);

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
        const currentDeckLeft = deckLeft + i * 100;
        const currentDeckTop = deckTop + deck[i].length * baseFontSize * 2;
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

  const stackToDeck = (cardStack: number[], prevDeckIndex: number, nextDeckIndex: number) => {
    const newDeck = deck.slice();
    if (prevDeckIndex !== -1) {
      newDeck[prevDeckIndex] = newDeck[prevDeckIndex].filter(d => !cardStack.includes(d));
    }
    newDeck[nextDeckIndex].push(...cardStack);
    setDeck(newDeck);
  }

  const cardEvent = (cardIndex: number, mouseDownEvent: React.MouseEvent) => {
    const deckIndex = cardDatas[cardIndex].deckIndex;
    let selectedStack = [cardIndex];
    if (deckIndex !== -1) {
      selectedStack = deck[deckIndex].slice(deck[deckIndex].indexOf(cardIndex));
    }

    const prevX = cardDatas[cardIndex].x;
    const prevY = cardDatas[cardIndex].y;
    checkDeck(deckIndex, mouseDownEvent.pageX, mouseDownEvent.pageY);

    const mouseMove = (mouseMoveEvent: MouseEvent) => {
      const newCardDatas = cardDatas.slice();

      selectedStack.forEach((cardIndex, stackIndex) => {
        newCardDatas[cardIndex] = {
          ...newCardDatas[cardIndex],
          x: checkBoundary(mouseMoveEvent.pageX - cardWidth / 2,
                            0,
                            window.innerWidth - cardWidth,
                            baseFontSize),
          y: checkBoundary(mouseMoveEvent.pageY - baseFontSize * 2 + stackIndex * baseFontSize * 2,
                            0,
                            window.innerHeight - cardHeight - (selectedStack.length - stackIndex - 1) * baseFontSize * 2,
                            baseFontSize),
          isClicked: true,
        };
      });

      if (checkDeck(deckIndex, mouseMoveEvent.pageX, mouseMoveEvent.pageY) === -1) {
        setFocusedDeck(-1);
      }
      setCardDatas(newCardDatas);
    }

    const mouseUp = (mouseUpEvent: MouseEvent) => {
      const moveResult = checkDeck(deckIndex, mouseUpEvent.pageX, mouseUpEvent.pageY);
      const newCardDatas = cardDatas.slice();

      selectedStack.forEach((cardIndex, stackIndex) => {
        if (moveResult !== -1) {
          newCardDatas[cardIndex] = {
            x: deckLeft + moveResult * 100 + baseFontSize / 2,
            y: deckTop + baseFontSize / 2 + (deck[moveResult].length + stackIndex) * baseFontSize * 2,
            isClicked: false,
            deckIndex: moveResult,
          };
        }
        else {
          newCardDatas[cardIndex] = {
            x: prevX,
            y: prevY + stackIndex * baseFontSize * 2,
            isClicked: false,
            deckIndex: deckIndex,
          };
        }
      });

      if (moveResult !== -1) {
        stackToDeck(selectedStack, deckIndex, moveResult);
      }
      setCardDatas(newCardDatas);
      setFocusedDeck(-1);
      document.removeEventListener('mousemove', mouseMove);
    }

    const newCardDatas = cardDatas.slice();
    selectedStack.forEach((cardIndex, stackIndex) => {
      newCardDatas[cardIndex] = {
        ...newCardDatas[cardIndex],
        x: checkBoundary(mouseDownEvent.pageX - cardWidth / 2,
                          0,
                          window.innerWidth - cardWidth,
                          baseFontSize),
        y: checkBoundary(mouseDownEvent.pageY - baseFontSize * 2 + stackIndex * baseFontSize * 2,
                          0,
                          window.innerHeight - cardHeight - (selectedStack.length - stackIndex - 1) * baseFontSize * 2,
                          baseFontSize),
        isClicked: true,
      };
      
      if (cardRefs.current[cardIndex] !== null) {
        cardRefs.current[cardIndex]!.style.zIndex = (zIndex + stackIndex).toString();
      }
    });
    setCardDatas(newCardDatas);
    setZIndex(zIndex + selectedStack.length);

    console.log(zIndex);

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp, { once: true });
  }

  return (
    <>
    <div
      className={styles.board}
    >
      <div className={styles.stock} />
      {topDeck.map((td, i) => (
        <div 
          key={i}
          className={styles.deck}
          style={{
            left: 500 + i * 100,
            top: 50,
          }}
        />
      ))}
      {deck.map((d, i) => (
        <div
          key={i}
          className={styles.deck}
          style={{
            left: deckLeft + i * 100,
            top: deckTop,
            border: `${focusedDeck === i ? 2 : 0}px solid yellow`
          }}
        />
      ))}
      {cardDatas.map((card, i) => (
        <Card
          key={i}
          cardIndex={i}
          ref={(el) => cardRefs.current[i] = el}
          onMouseDown={(mouseDownEvent) => {
            mouseDownEvent.preventDefault();
            mouseDownEvent.stopPropagation();
            cardEvent(i, mouseDownEvent);
          }}
          x={card.x}
          y={card.y}
          isClicked={card.isClicked}
        />
      ))}
    </div>
    </>
  );
}

export default App;
