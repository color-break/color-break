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
const SPAWNPOINT = [Math.trunc(config.tiles.x / 2), 0];

/**
 * Generate a random color from color configuration.
 *
 * @return {String}
 */
const createColor = () => {
  const keys = Object.keys(config.colors);
  const random = keys[(keys.length * Math.random()) << 0];

  return config.colors[random];
};

/**
 * Generate a default entity for GameEngine component used later.
 *
 * @param  {Number}  x - Indicates the x coordinate in array tiles.
 * @param  {Number}  y - Indicates the y coordinate in array tiles.
 * @param  {String}  [color=null] - The color for tiles.
 * @param  {Boolean} [active=false] - Active status for current tile.
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
 * Generate an array of active tiles coordination.
 *
 * @param  {String}  type - Used to determine which tiles pattern to return.
 * @return {Array}
 */
const getPattern = type => {
  const x = SPAWNPOINT[0];
  const y = SPAWNPOINT[1];

  switch (type) {
    case 'plate':
      return [[x, y], [x + 1, y]];
    default:
      return [[x, y], [x, y + 1]];
  }
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

/**
 * PlayField React component.
 *
 * @return {Object}
 */
export default () => {
  const [entities, setEntities] = useState(createEntities());
  const [activeBlock, setActiveBlock] = useState(false);
  const [activePos, setActivePos] = useState(getPattern('default'));

  const spawnBlock = () => {
    if (!activeBlock) {
      let available = true;

      activePos.forEach(item => {
        if (entities[`${item[0]}${item[1]}`].color) {
          available = false;
        }
      });

      if (available) {
        setActiveBlock(true);

        setActivePos(previous => {
          let state = previous;
          return state.sort(function(a, b) {
            return b[1] - a[1];
          });
        });

        setEntities(previous => {
          let state = previous;

          activePos.forEach(item => {
            state[`${item[0]}${item[1]}`].color = createColor();
            state[`${item[0]}${item[1]}`].active = true;
          });

          return state;
        });
      }
    }
  };

  const dropActiveBlock = () => {
    const posBelow = activePos[0][1] + 1;

    if (
      activeBlock &&
      posBelow < config.tiles.y &&
      entities[`${activePos[0][0]}${posBelow}`] &&
      !entities[`${activePos[0][0]}${posBelow}`].color
    ) {
      setEntities(previous => {
        let state = previous;
        activePos.forEach(item => reorder(item[0], item[1]));

        return state;
      });

      setActivePos(previous => {
        let state = previous;
        state.forEach(item => item[1]++);

        return state;
      });
    } else {
      setEntities(previous => {
        let state = previous;
        activePos.forEach(item => (state[`${item[0]}${item[1]}`].active = false));

        return state;
      });

      setActiveBlock(false);
      setActivePos(getPattern('default'));
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

  const onTapRotate = () => {
    //
  };

  const update = () => {
    spawnBlock();

    return entities;
  };

  return (
    <>
      <GameEngine style={styles.engine} systems={[update]} entities={entities} />
      <Control moveLeft={onTapLeft} moveDown={onTapDown} moveRight={onTapRight} rotate={onTapRotate} />
    </>
  );
};
