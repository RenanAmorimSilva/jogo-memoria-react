import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoIntem';
import { GridItem } from './components/GridItem';


import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';



const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);
  
  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if(playing)setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);
  // verificar se as abertas são iguais
  useEffect(() => {
    if(shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2) {

        

        if(opened[0].item === opened[1].item) {
          // se forem iguais, torn-os permanentes
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].shown = false
             }
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }else {
              //se não forem iguais, feche-os 
              setTimeout(() => {
                let tmpGrid = [...gridItems];
                 for(let i in tmpGrid) {
                tmpGrid[i].shown = false;
              }
              setGridItems(tmpGrid);
              setShownCount(0); 
              }, 400);
            }
            setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  // verficando se o jogo terminou
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShow === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);
  
  const resetAndCreateGrid = ()=> {
    // 1.0 resetar jogo 
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    // 2.0 criar grid
    // 2.1 criar grid vazio
    let tempGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) tempGrid.push({ 
      item: null, shown: false, permanentShow:false
    });
    // 2.2 preencher grid
    for(let w = 0; w < 2; w++) {
      for(let i = 0; i < (items.length); i++) {
        let pos = -1;
        while (pos < 0 || tempGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tempGrid[pos].item = i;
      }
    }
    // 2.3 jogar no state
    setGridItems(tempGrid);
    // 3 começar jogo 
    setPlaying(true);
  }

  const handleIntemClick = (index: number) => {
    if(playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      if (tmpGrid[index].permanentShow === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      } 
      setGridItems(tmpGrid);
    }
  }

  return (
    <div>
      <C.Container>
        <C.Info>
            <C.LogoLink href="">
                <img src={logoImage} alt="" width="200" />
            </C.LogoLink>
            <C.InfoArea>
              <InfoItem label="tempo" value={formatTimeElapsed(timeElapsed)}/>
              <InfoItem label="Movimentos" value={moveCount.toString()}/>
            </C.InfoArea>
            <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid}/> 
        </C.Info>
        <C.GridArea>
          <C.Grid>
            {gridItems.map((item, index) => (
              <GridItem 
                key={index}
                item={item}
                onClick={() => handleIntemClick(index)}
              />
            ))}
          </C.Grid>
        </C.GridArea>
      </C.Container>
    </div>
  );
}

export default App;