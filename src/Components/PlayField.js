/**
 * Play field component. This component will handle our game state and play area.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Control from './Control';
import Block from './Game/Block';

const {width, height} = Dimensions.get('window');
const HORIZONTAL = 5;
const VERTICAL = 11;
const SPAWNPOINT = [Math.trunc(HORIZONTAL / 2), 1];
const BLOCKWIDTH = width / 9;
const OFFSETX = (width - BLOCKWIDTH * HORIZONTAL) / 2;
const OFFSETY = (height - BLOCKWIDTH * VERTICAL) / 4;

const createColor = color => {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const random = Math.floor(Math.random() * Math.floor(colors.length));
  return color ? colors[random] : null;
};

const createEntity = (x, y, color = null, active = false) => {
  return {
    width: BLOCKWIDTH,
    height: BLOCKWIDTH,
    position: [OFFSETX + x * BLOCKWIDTH, OFFSETY + y * BLOCKWIDTH],
    coordinate: [x, y],
    color: color,
    active: active,
    renderer: <Block />,
  };
};

const createEntities = () => {
  let entities = {};

  for (let x = 0; x < HORIZONTAL; x++) {
    for (let y = 0; y < VERTICAL; y++) {
      entities[`${x}${y}`] = createEntity(x, y);
    }
  }

  return entities;
};

const PlayField = () => {
  const [entities, setEntities] = useState(createEntities());
  const [activeBlock, setActiveBlock] = useState(false);
  const [activePos, setActivePos] = useState(SPAWNPOINT);

  const spawnBlock = () => {
    if (
      !activeBlock &&
      !entities[`${activePos[0]}${activePos[1]}`].color &&
      !entities[`${activePos[0]}${activePos[1] - 1}`].color
    ) {
      setActiveBlock(true);
      setEntities(previous => {
        let state = previous;

        state[`${activePos[0]}${activePos[1]}`].color = createColor(true);
        state[`${activePos[0]}${activePos[1]}`].active = true;
        state[`${activePos[0]}${activePos[1] - 1}`].color = createColor(true);
        state[`${activePos[0]}${activePos[1] - 1}`].active = true;

        return state;
      });
    }
  };

  const dropActiveBlock = () => {
    const posBelow = activePos[1] + 1;

    if (
      activeBlock &&
      posBelow < VERTICAL &&
      !entities[`${activePos[0]}${posBelow}`].color
    ) {
      reorder(activePos[0], activePos[1]);
      reorder(activePos[0], activePos[1] - 1);
      setActivePos([activePos[0], posBelow]);
    } else {
      setEntities(previous => {
        let state = previous;

        state[`${activePos[0]}${activePos[1]}`].active = false;
        state[`${activePos[0]}${activePos[1] - 1}`].active = false;

        return state;
      });

      setActiveBlock(false);
      setActivePos(SPAWNPOINT);
    }
  };

  const check = () => {
    for (let i = 0; i < HORIZONTAL; i++) {
      for (let j = 0; j < VERTICAL; j++) {
        if (
          j + 1 < VERTICAL &&
          entities[`${i}${j}`].color &&
          !entities[`${i}${j + 1}`].color &&
          !entities[`${i}${j}`].active
        ) {
          reorder(i, j);
        }
      }
    }
  };

  function reorder(i, j) {
    setEntities(previous => {
      let state = previous;

      state[`${i}${j + 1}`].color = state[`${i}${j}`].color;
      state[`${i}${j}`].color = null;

      const tempStatus = state[`${i}${j + 1}`].active;
      state[`${i}${j + 1}`].active = state[`${i}${j}`].active;
      state[`${i}${j}`].active = tempStatus;

      return state;
    });
  }

  function move(destination) {
    setEntities(previous => {
      let state = previous;

      let temp = state[`${activePos[0]}${activePos[1]}`].color;
      state[`${activePos[0]}${activePos[1]}`].color =
        state[`${destination[0]}${destination[1]}`].color;
      state[`${destination[0]}${destination[1]}`].color = temp;

      temp = state[`${activePos[0]}${activePos[1]}`].active;
      state[`${activePos[0]}${activePos[1]}`].active =
        state[`${destination[0]}${destination[1]}`].active;
      state[`${destination[0]}${destination[1]}`].active = temp;

      temp = state[`${activePos[0]}${activePos[1] - 1}`].color;
      state[`${activePos[0]}${activePos[1] - 1}`].color =
        state[`${destination[0]}${destination[1] - 1}`].color;
      state[`${destination[0]}${destination[1] - 1}`].color = temp;

      temp = state[`${activePos[0]}${activePos[1] - 1}`].active;
      state[`${activePos[0]}${activePos[1] - 1}`].active =
        state[`${destination[0]}${destination[1] - 1}`].active;
      state[`${destination[0]}${destination[1] - 1}`].active = temp;

      return state;
    });
  }

  const onTapLeft = () => {
    if (
      activePos[0] > 0 &&
      !entities[`${activePos[0] - 1}${activePos[1]}`].color
    ) {
      move([activePos[0] - 1, activePos[1]]);
      setActivePos([activePos[0] - 1, activePos[1]]);
    }

    console.log('move left', activePos[0]);
  };

  const onTapDown = () => {
    dropActiveBlock();
    console.log('move down');
  };

  const onTapRight = () => {
    if (
      activePos[0] < HORIZONTAL - 1 &&
      !entities[`${activePos[0] + 1}${activePos[1]}`].color
    ) {
      move([activePos[0] + 1, activePos[1]]);
      setActivePos([activePos[0] + 1, activePos[1]]);
    }

    console.log('move right', activePos[0], HORIZONTAL);
  };

  const update = () => {
    spawnBlock();
    check();

    return entities;
  };

  return (
    <>
      <GameEngine
        style={styles.engine}
        systems={[update]}
        entities={entities}
      />
      <Control
        moveLeft={onTapLeft}
        moveDown={onTapDown}
        moveRight={onTapRight}
      />
    </>
  );
};

const styles = {
  engine: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: width * 0.02,
  },
  bottomMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default PlayField;
