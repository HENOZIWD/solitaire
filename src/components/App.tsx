import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/App.module.css';
import Card from './card';

interface ICardPosition {
  x: number;
  y: number;
  isClicked: boolean;
  deckIndex: number;
  status: string;
}

const App = () => {

  const baseFontSizeString = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  const baseFontSize = +baseFontSizeString.slice(0, baseFontSizeString.indexOf('px'));
  const cardWidth = baseFontSize * 5;
  const cardHeight = baseFontSize * 7;
  const deckLeft = baseFontSize * 12;
  const deckTop = baseFontSize * 15;
  const deckWidth = baseFontSize * 6;
  const deckHeight = baseFontSize * 8;
  const stockLeft = baseFontSize * 3;
  const stockTop = baseFontSize * 3;

  const [cardDatas, setCardDatas] = useState<ICardPosition[]>(Array.from({ length: 52 }, () => ({
      x: 0,
      y: 0,
      isClicked: false,
      deckIndex: -1,
      status: 'stock',
    })));
  const [zIndex, setZIndex] = useState<number>(1);
  // const [deck, setDeck] = useState<number[][]>(Array.from({ length: 7 }, () => []));
  const [deck, setDeck] = useState<number[][]>([
    [0],
    [5, 2],
    [7, 3, 8],
    [13, 38, 43, 22],
    [1, 51, 50, 44, 33],
    [15, 17, 14, 21, 30, 48],
    [10, 20, 47, 32, 19, 29, 11],
  ]);
  const [focusedDeck, setFocusedDeck] = useState<number>(-1);
  const [stock, setStock] = useState<number[]>([
    4, 6, 9, 12, 16, 18, 23, 24, 25, 26, 27, 28, 31, 34, 35,
    36, 37, 39, 40, 41, 42, 45, 46, 49,
  ]);
  const [stockIndex, setStockIndex] = useState<number>(0);
  const [topDeck, setTopDeck] = useState<number[][]>(Array.from({ length: 4 }, () => []));

  const cardRefs = useRef<HTMLDivElement[] | null[]>([]);

  useEffect(() => {
    const newCardDatas = cardDatas.slice();
    deck.forEach((d) => {
      if (cardDatas[d[d.length - 1]].status === 'fold') {
        newCardDatas[d[d.length - 1]] = {
          ...newCardDatas[d[d.length - 1]],
          status: 'open',
        };
      }
    });
    setCardDatas(newCardDatas);
    console.log(deck);
  }, [deck])

  useEffect(() => {
    /*
    ** When Game Starts
    */

    const newCardDatas = cardDatas.slice();

    deck.forEach((d, deckIndex) => {
      d.forEach((cardIndex, i) => {
        newCardDatas[cardIndex] = {
          ...newCardDatas[cardIndex],
          x: deckLeft + deckIndex * baseFontSize * 7 + baseFontSize / 2,
          y: deckTop + baseFontSize / 2 + i * baseFontSize * 2,
          deckIndex: deckIndex,
          status: i === d.length - 1 ? 'open' : 'fold',
        }
        if (cardRefs.current[cardIndex] !== null) {
          cardRefs.current[cardIndex]!.style.zIndex = (zIndex + i).toString();
        }
      });
    });

    stock.forEach((cardIndex) => {
      newCardDatas[cardIndex] = {
        ...newCardDatas[cardIndex],
        x: stockLeft + baseFontSize / 2,
        y: stockTop + baseFontSize / 2,
        deckIndex: -1,
        status: 'stock',
      }
    })

    setCardDatas(newCardDatas);
    setZIndex(zIndex + 7);
    console.log("start");
  }, [])

  const checkBoundary = (val: number, min: number, max: number, pad: number) => {
    
    if (val < min + pad) {
      return min + pad;
    }
    else if (max - pad < val) {
      return max - pad;
    }

    return val;
  }

  const checkDeck = (cardIndex: number, prevDeckIndex: number, x: number, y: number) => {
    let deckIndex = -1;
    for (let i = 0; i < deck.length; i++) {
      if (i !== prevDeckIndex) {
        const currentDeck = deck[i];
        const currentDeckLeft = deckLeft + i * baseFontSize * 7;
        const currentDeckTop = deckTop + currentDeck.length * baseFontSize * 2;
        if (currentDeckLeft < x && x < currentDeckLeft + deckWidth &&
            currentDeckTop < y && y < currentDeckTop + deckHeight) {
          
          if ((currentDeck.length === 0 && cardIndex % 13 === 12) ||
              (currentDeck.length > 0 && currentDeck[currentDeck.length - 1] % 13 === cardIndex % 13 + 1 &&
              Math.floor(currentDeck[currentDeck.length - 1] / 13) % 2 !== Math.floor(cardIndex / 13) % 2)) { // odd => red, even => black
            setFocusedDeck(i);
            deckIndex = i;
            break;
          }
        }
      }
    }

    return deckIndex;
  }

  const stackToDeck = (cardStack: number[], prevDeckIndex: number, nextDeckIndex: number) => {
    const newDeck = deck.slice();
    if (prevDeckIndex === -1) { // stocked
      let newStock = stock.slice();
      newStock = newStock.filter(s => !cardStack.includes(s));
      setStock(newStock);
    }
    else {
      newDeck[prevDeckIndex] = newDeck[prevDeckIndex].filter(d => !cardStack.includes(d));
    }
    newDeck[nextDeckIndex].push(...cardStack);
    setDeck(newDeck);
  }

  const cardEvent = (cardIndex: number, mouseDownEvent: React.MouseEvent) => {
    if (cardDatas[cardIndex].status === 'open') {
      const deckIndex = cardDatas[cardIndex].deckIndex;
      let selectedStack = [cardIndex];
      if (deckIndex !== -1) {
        selectedStack = deck[deckIndex].slice(deck[deckIndex].indexOf(cardIndex));
      }

      const prevX = cardDatas[cardIndex].x;
      const prevY = cardDatas[cardIndex].y;
      checkDeck(cardIndex, deckIndex, mouseDownEvent.pageX, mouseDownEvent.pageY);

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

        if (checkDeck(cardIndex, deckIndex, mouseMoveEvent.pageX, mouseMoveEvent.pageY) === -1) {
          setFocusedDeck(-1);
        }
        setCardDatas(newCardDatas);
      }

      const mouseUp = (mouseUpEvent: MouseEvent) => {
        const moveResult = checkDeck(cardIndex, deckIndex, mouseUpEvent.pageX, mouseUpEvent.pageY);
        const newCardDatas = cardDatas.slice();

        selectedStack.forEach((cardIndex, stackIndex) => {
          if (moveResult !== -1) {
            newCardDatas[cardIndex] = {
              x: deckLeft + moveResult * baseFontSize * 7 + baseFontSize / 2,
              y: deckTop + baseFontSize / 2 + (deck[moveResult].length + stackIndex) * baseFontSize * 2,
              isClicked: false,
              deckIndex: moveResult,
              status: 'open',
            };
          }
          else {
            newCardDatas[cardIndex] = {
              x: prevX,
              y: prevY + stackIndex * baseFontSize * 2,
              isClicked: false,
              deckIndex: deckIndex,
              status: 'open',
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
  }

  const defineSuit = (n: number) => {
    if (n === 0) {
      return 'Club';
    }
    else if (n === 1) {
      return 'Diamond';
    }
    else if (n === 2) {
      return 'Spade';
    }
    else if (n === 3) {
      return 'Heart';
    }
    else {
      return 'ERROR';
    }
  }

  const rank = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const defineRank = (n: number) => {
    if (0 <= n && n <= 13) {
      return rank[n];
    }
    else {
      return 'ERROR';
    }
  }

  return (
    <>
    <div
      className={styles.board}
    >
      <div
        className={styles.stock}
        style={{ backgroundColor: 'lightblue' }}
      />
      {topDeck.map((td, i) => (
        <div 
          key={i}
          className={styles.deck}
          style={{
            left: baseFontSize * 33 + i * baseFontSize * 7,
            top: baseFontSize * 3,
          }}
        />
      ))}
      {deck.map((d, i) => (
        <div
          key={i}
          className={styles.deck}
          style={{
            left: deckLeft + i * baseFontSize * 7,
            top: deckTop,
            border: `${focusedDeck === i ? 2 : 0}px solid yellow`
          }}
        />
      ))}
      {cardDatas.map((card, i) => (
        <Card
          key={i}
          cardIndex={i}
          suit={defineSuit(Math.floor(i / 13))}
          rank={defineRank(i % 13)}
          ref={(el) => cardRefs.current[i] = el}
          onMouseDown={(mouseDownEvent) => {
            mouseDownEvent.preventDefault();
            mouseDownEvent.stopPropagation();
            cardEvent(i, mouseDownEvent);
          }}
          x={card.x}
          y={card.y}
          isClicked={card.isClicked}
          status={card.status}
        />
      ))}
    </div>
    </>
  );
}

export default App;
