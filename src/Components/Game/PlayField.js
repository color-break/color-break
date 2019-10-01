/**
 * Play field component. This component will handle our game state and play area.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React, {useState} from 'react';
import {GameEngine} from 'react-native-game-engine';
import Block from './Block';
import Control from './Control';
import config from '../../Config';

/**
 * Block tiles spawn point.
 *
 * @var {Array}
 */
const SPAWNPOINT = [Math.trunc(config.tiles.x / 2), 1];

/**
 * Generate a random color from color configuration.
 *
 * @return {String}
 */
const createColor = () => {
  const random = Math.floor(Math.random() * Math.floor(config.colors.length));

  return config.colors[random];
};

/**
 * Generate a default entity for GameEngine component used later.
 *
 * @param {Number}  x - Indicates the x coordinate in array tiles.
 * @param {Number}  y - Indicates the y coordinate in array tiles.
 * @param {String}  [color=null] - The color for tiles.
 * @param {Boolean} [active=false] - Active status for current tile.
 * @return {Object}
 */
const createEntity = (x, y, color = null, active = false) => {
  return {
    width: config.block.width,
    height: config.block.height,
    position: [config.offset.x + x * config.block.width, config.offset.y + y * config.block.height],
    coordinate: [x, y],
    color: color,
    active: active,
    renderer: <Block />,
  };
};

/**
 * Generate entities for default component state.
 *
 * @return {Object}
 */
const createEntities = () => {
  let entities = {};

  for (let x = 0; x < config.tiles.x; x++) {
    for (let y = 0; y < config.tiles.y; y++) {
      entities[`${x}${y}`] = createEntity(x, y);
    }
  }

  return entities;
};

/**
 * Component stylesheet.
 *
 * @var {Object}
 */
const styles = {
  engine: {
    flex: 1,
  },
};

export default () => {
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

    if (activeBlock && posBelow < config.tiles.y && !entities[`${activePos[0]}${posBelow}`].color) {
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
    for (let i = 0; i < config.tiles.x; i++) {
      for (let j = 0; j < config.tiles.y; j++) {
        if (
          j + 1 < config.tiles.y &&
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
      state[`${activePos[0]}${activePos[1]}`].color = state[`${destination[0]}${destination[1]}`].color;
      state[`${destination[0]}${destination[1]}`].color = temp;

      temp = state[`${activePos[0]}${activePos[1]}`].active;
      state[`${activePos[0]}${activePos[1]}`].active = state[`${destination[0]}${destination[1]}`].active;
      state[`${destination[0]}${destination[1]}`].active = temp;

      temp = state[`${activePos[0]}${activePos[1] - 1}`].color;
      state[`${activePos[0]}${activePos[1] - 1}`].color = state[`${destination[0]}${destination[1] - 1}`].color;
      state[`${destination[0]}${destination[1] - 1}`].color = temp;

      temp = state[`${activePos[0]}${activePos[1] - 1}`].active;
      state[`${activePos[0]}${activePos[1] - 1}`].active = state[`${destination[0]}${destination[1] - 1}`].active;
      state[`${destination[0]}${destination[1] - 1}`].active = temp;

      return state;
    });
  }

  const onTapLeft = () => {
    if (activePos[0] > 0 && !entities[`${activePos[0] - 1}${activePos[1]}`].color) {
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
    if (activePos[0] < config.tiles.x - 1 && !entities[`${activePos[0] + 1}${activePos[1]}`].color) {
      move([activePos[0] + 1, activePos[1]]);
      setActivePos([activePos[0] + 1, activePos[1]]);
    }

    console.log('move right', activePos[0], config.tiles.x);
  };

  const update = () => {
    spawnBlock();
    check();

    return entities;
  };

  return (
    <>
      <GameEngine style={styles.engine} systems={[update]} entities={entities} />
      <Control moveLeft={onTapLeft} moveDown={onTapDown} moveRight={onTapRight} />
    </>
  );
};
