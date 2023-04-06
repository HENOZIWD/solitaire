import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/App.module.css';
import Card from './card';

interface ICardPosition {
  x: number;
  y: number;
  isClicked: boolean;
  deckIndex: number;
  topDeckIndex: number;
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
  const topDeckLeft = baseFontSize * 33;
  const topDeckTop = baseFontSize * 3;

  const [cardDatas, setCardDatas] = useState<ICardPosition[]>(Array.from({ length: 52 }, () => ({
      x: 0,
      y: 0,
      isClicked: false,
      deckIndex: -1,
      topDeckIndex: -1,
      status: 'stock',
    })));
  const [zIndex, setZIndex] = useState<number>(1);
  const [deck, setDeck] = useState<number[][]>(Array.from({ length: 7 }, () => []));
  const [focusedDeck, setFocusedDeck] = useState<number>(-1);
  const [focusedTopDeck, setFocusedTopDeck] = useState<number>(-1);
  const [stock, setStock] = useState<number[]>([]);
  const [topDeck, setTopDeck] = useState<number[][]>(Array.from({ length: 4 }, () => []));

  const cardRefs = useRef<HTMLDivElement[] | null[]>([]);

  const getRandomInt = (min: number, max: number) => { // include max range
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const newCardDatas = cardDatas.slice();
    deck.forEach((d) => {
      if (d.length > 0 && cardDatas[d[d.length - 1]].status === 'fold') {
        newCardDatas[d[d.length - 1]] = {
          ...newCardDatas[d[d.length - 1]],
          status: 'open',
        };
      }
    });
    setCardDatas(newCardDatas);
    // console.log(deck);
  }, [deck])

  useEffect(() => {
    // console.log(topDeck);
  }, [topDeck])

  useEffect(() => {
    /*
    ** When Game Starts
    */

    let startStock = Array.from({ length: 52 }, (v, i) => i);
    const startDeck = [];
    for (let i = 0; i < 7; i++) {
      const currentDeck = [];
      for (let j = 0; j <= i; j++) {
        let randomInt = getRandomInt(0, 51);
        while (!startStock.includes(randomInt)) { // if duplicated
          randomInt = getRandomInt(0, 51); // re-generate
        }
        currentDeck.push(randomInt);
        startStock = startStock.filter(n => n !== randomInt);
      }
      startDeck.push(currentDeck);
    }

    // shuffle stock with Fisher-Yates algorithm
    for (let i = startStock.length - 1; i > 0; i--) {
      const randomInt = getRandomInt(0, i);
      [startStock[randomInt], startStock[i]] = [startStock[i], startStock[randomInt]];
    }

    const newCardDatas = cardDatas.slice();

    startDeck.forEach((d, deckIndex) => {
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

    startStock.forEach((cardIndex, i) => {
      newCardDatas[cardIndex] = {
        ...newCardDatas[cardIndex],
        x: stockLeft + baseFontSize / 2,
        y: stockTop + baseFontSize / 2,
        deckIndex: -1,
        status: 'stock',
      }
      if (cardRefs.current[cardIndex] !== null) {
        cardRefs.current[cardIndex]!.style.zIndex = (zIndex + i).toString();
      }
    });

    setStock(startStock);
    setDeck(startDeck);
    setCardDatas(newCardDatas);
    setZIndex(z => z + startStock.length);
    // console.log("start");
    // console.log(startStock);
    // console.log(startDeck);
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

  const checkTopDeck = (cardIndex: number, prevTopDeckIndex: number, x: number, y: number) => {
    let topDeckIndex = -1;
    const suitIndex = Math.floor(cardIndex / 13);
    const currentTopDeckLeft = topDeckLeft + suitIndex * baseFontSize * 7;

    if (prevTopDeckIndex !== suitIndex &&
        currentTopDeckLeft < x && x < currentTopDeckLeft + deckWidth &&
        topDeckTop < y && y < topDeckTop + deckHeight &&
        topDeck[suitIndex].length === cardIndex % 13) {
      
      setFocusedTopDeck(suitIndex);
      topDeckIndex = suitIndex;
    }

    return topDeckIndex;
  }

  const stackToTopDeck = (cardIndex: number, prevDeckIndex: number, suit: number) => {
    let newStock = stock.slice();
    const newDeck = deck.slice();
    const newTopDeck = topDeck.slice();

    if (prevDeckIndex === -1) { // stocked
      newStock = newStock.filter(s => s !== cardIndex);
    }
    else { // in deck
      newDeck[prevDeckIndex] = newDeck[prevDeckIndex].filter(d => d !== cardIndex)
    }

    newTopDeck[suit].push(cardIndex);

    setStock(newStock);
    setDeck(newDeck);
    setTopDeck(newTopDeck);
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

  const stackToDeck = (cardStack: number[], prevDeckIndex: number, prevTopDeckIndex: number, nextDeckIndex: number) => {
    let newStock = stock.slice();
    const newDeck = deck.slice();
    const newTopDeck = topDeck.slice();
    if (prevDeckIndex === -1 && prevTopDeckIndex === -1) { // stocked
      newStock = newStock.filter(s => !cardStack.includes(s));
    }
    else if (prevDeckIndex !== -1) { // in deck
      newDeck[prevDeckIndex] = newDeck[prevDeckIndex].filter(d => !cardStack.includes(d));
    }
    else if (cardStack.length === 1 && prevTopDeckIndex !== -1) { // in topDeck
      newTopDeck[prevTopDeckIndex].pop();
    }
    newDeck[nextDeckIndex].push(...cardStack);

    setStock(newStock);
    setDeck(newDeck);
    setTopDeck(newTopDeck);
  }

  const cardEvent = (cardIndex: number, mouseDownEvent: React.MouseEvent) => {
    if (cardDatas[cardIndex].status === 'open') {
      const deckIndex = cardDatas[cardIndex].deckIndex;
      const topDeckIndex = cardDatas[cardIndex].topDeckIndex;
      let selectedStack = [cardIndex];
      if (deckIndex !== -1) {
        selectedStack = deck[deckIndex].slice(deck[deckIndex].indexOf(cardIndex));
      }

      const prevX = cardDatas[cardIndex].x;
      const prevY = cardDatas[cardIndex].y;
      // checkDeck(cardIndex, deckIndex, mouseDownEvent.pageX, mouseDownEvent.pageY);

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
        if (checkTopDeck(cardIndex, topDeckIndex, mouseMoveEvent.pageX, mouseMoveEvent.pageY) === -1) {
          setFocusedTopDeck(-1);
        }
        setCardDatas(newCardDatas);
      }

      const mouseUp = (mouseUpEvent: MouseEvent) => {
        const moveResult = checkDeck(cardIndex, deckIndex, mouseUpEvent.pageX, mouseUpEvent.pageY);
        const topMoveResult = selectedStack.length === 1 ? checkTopDeck(selectedStack[0], topDeckIndex, mouseUpEvent.pageX, mouseUpEvent.pageY) : -1;
        const newCardDatas = cardDatas.slice();

        selectedStack.forEach((cardIndex, stackIndex) => {
          if (moveResult !== -1) {
            newCardDatas[cardIndex] = {
              x: deckLeft + moveResult * baseFontSize * 7 + baseFontSize / 2,
              y: deckTop + baseFontSize / 2 + (deck[moveResult].length + stackIndex) * baseFontSize * 2,
              isClicked: false,
              deckIndex: moveResult,
              topDeckIndex: -1,
              status: 'open',
            };
          }
          else if (topMoveResult !== -1) {
            newCardDatas[cardIndex] = {
              x: topDeckLeft + topMoveResult * baseFontSize * 7 + baseFontSize / 2,
              y: topDeckTop + baseFontSize / 2,
              isClicked: false,
              deckIndex: -1,
              topDeckIndex: topMoveResult,
              status: 'open',
            };
          }
          else {
            newCardDatas[cardIndex] = {
              ...newCardDatas[cardIndex],
              x: prevX,
              y: prevY + stackIndex * baseFontSize * 2,
              isClicked: false,
            };
          }
        });

        if (moveResult !== -1) { // stack to deck
          stackToDeck(selectedStack, deckIndex, topDeckIndex, moveResult);
        }
        else if (topMoveResult !== -1) { // stack to top deck
          stackToTopDeck(selectedStack[0], deckIndex, topMoveResult);
        }
        setCardDatas(newCardDatas);
        setFocusedDeck(-1);
        setFocusedTopDeck(-1);
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
      setZIndex(z => z + selectedStack.length);

      console.log(zIndex);

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp, { once: true });
    }
    else if (cardDatas[cardIndex].status === 'stock') {
      const newCardDatas = cardDatas.slice();
      newCardDatas[cardIndex] = {
        ...newCardDatas[cardIndex],
        x: stockLeft + baseFontSize * 8,
        y: stockTop + baseFontSize / 2,
        status: 'open',
      }
      
      if (cardRefs.current[cardIndex] !== null) {
        cardRefs.current[cardIndex]!.style.zIndex = zIndex.toString();
      }

      setCardDatas(newCardDatas);
      setZIndex(z => z + 1);
      // console.log(cardIndex);
    }
  }

  const suit = ['Club', 'Diamond', 'Spade', 'Heart'];
  const rank = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const defineSuit = (n: number) => {
    if (0 <= n && n < 4) {
      return suit[n];
    }
    else {
      return 'Error';
    }
  }

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
        onClick={() => {
          const newCardDatas = cardDatas.slice();
          stock.forEach((cardIndex, i) => {
            newCardDatas[cardIndex] = {
              ...newCardDatas[cardIndex],
              x: stockLeft + baseFontSize / 2,
              y: stockTop + baseFontSize / 2,
              deckIndex: -1,
              status: 'stock',
            }

            if (cardRefs.current[cardIndex] !== null) {
              cardRefs.current[cardIndex]!.style.zIndex = (zIndex + i).toString();
            }
          });
          setCardDatas(newCardDatas);
          setZIndex(z => z + stock.length);
        }}
      />
      {topDeck.map((td, i) => (
        <div 
          key={i}
          className={styles.deck}
          style={{
            left: topDeckLeft + i * baseFontSize * 7,
            top: topDeckTop,
            border: `${focusedTopDeck === i ? 2 : 0}px solid yellow`
          }}
        >
          {defineSuit(i)}
        </div>
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
