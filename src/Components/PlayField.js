/**
 * Play field component. This component will handle our game state and play area.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React, {useState, useEffect} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Control from './Control';

const {width, height} = Dimensions.get('window');
const HORIZONTAL = 5;
const VERTICAL = 11;
const SPEED = 3;
const SPAWNPOINT = [Math.trunc(HORIZONTAL / 2), 1];
const BLOCKWIDTH = width / 9;
const OFFSETX = (width - BLOCKWIDTH * HORIZONTAL) / 2;
const OFFSETY = (height - BLOCKWIDTH * VERTICAL) / 4;
let ENTITY = {};

const Block = ({position, color, coordinate, active}) => {
  const style = {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: position[0],
    top: position[1],
    width: BLOCKWIDTH,
    height: BLOCKWIDTH,
    backgroundColor: color ? color : '#fff',
  };

  return (
    <View style={style}>
      <Text>
        [{coordinate[0]}, {coordinate[1]}]
      </Text>
    </View>
  );
};

const createColor = color => {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const random = Math.floor(Math.random() * Math.floor(colors.length));
  return color ? colors[random] : null;
};

const generateKey = tag => {
  return `${tag}_${new Date().getTime()}`;
};

const createEntity = () => {
  for (let i = 0; i < HORIZONTAL; i++) {
    for (let j = 0; j < VERTICAL; j++) {
      ENTITY[`b${i}${j}`] = {
        position: [OFFSETX + i * BLOCKWIDTH, OFFSETY + j * BLOCKWIDTH],
        color: createColor(false),
        coordinate: [i, j],
        active: false,
        renderer: <Block />,
      };
    }
  }
};

const PlayField = () => {
  const [fields, setFields] = useState([]);
  const [activeBlock, setActiveBlock] = useState(false);
  const [activePos, setActivePos] = useState(SPAWNPOINT);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => createEntity(), []);

  useEffect(() => {
    if (fields.length === 0) {
      let grid = [];

      for (let i = 0; i < HORIZONTAL; i++) {
        grid.push([]);
        for (let j = 0; j < VERTICAL; j++) {
          grid[i].push({
            pos: [i, j],
            object: null,
          });
        }
      }

      setFields(grid);
    }
  }, [fields]);

  const spawnBlock = () => {
    if (
      !activeBlock &&
      !ENTITY[`b${activePos[0]}${activePos[1]}`].color &&
      !ENTITY[`b${activePos[0]}${activePos[1] - 1}`].color
    ) {
      setActiveBlock(true);
      ENTITY[`b${activePos[0]}${activePos[1]}`].color = createColor(true);
      ENTITY[`b${activePos[0]}${activePos[1]}`].active = true;
      ENTITY[`b${activePos[0]}${activePos[1] - 1}`].color = createColor(true);
      ENTITY[`b${activePos[0]}${activePos[1] - 1}`].active = true;
    }
  };

  const dropActiveBlock = () => {
    const posBelow = activePos[1] + 1;

    if (
      activeBlock &&
      posBelow < VERTICAL &&
      !ENTITY[`b${activePos[0]}${posBelow}`].color
    ) {
      reorder(activePos[0], activePos[1]);
      reorder(activePos[0], activePos[1] - 1);
      setActivePos([activePos[0], posBelow]);
    } else {
      ENTITY[`b${activePos[0]}${activePos[1]}`].active = false;
      ENTITY[`b${activePos[0]}${activePos[1] - 1}`].active = false;
      setActiveBlock(false);
      setActivePos(SPAWNPOINT);
    }
  };

  const check = () => {
    for (let i = 0; i < HORIZONTAL; i++) {
      for (let j = 0; j < VERTICAL; j++) {
        if (
          j + 1 < VERTICAL &&
          ENTITY[`b${i}${j}`].color &&
          !ENTITY[`b${i}${j + 1}`].color &&
          !ENTITY[`b${i}${j}`].active
        ) {
          reorder(i, j);
        }
      }
    }
  };

  function reorder(i, j) {
    ENTITY[`b${i}${j + 1}`].color = ENTITY[`b${i}${j}`].color;
    ENTITY[`b${i}${j}`].color = null;

    const tempStatus = ENTITY[`b${i}${j + 1}`].active;
    ENTITY[`b${i}${j + 1}`].active = ENTITY[`b${i}${j}`].active;
    ENTITY[`b${i}${j}`].active = tempStatus;
  }

  function move(destination) {
    let temp = ENTITY[`b${activePos[0]}${activePos[1]}`].color;
    ENTITY[`b${activePos[0]}${activePos[1]}`].color =
      ENTITY[`b${destination[0]}${destination[1]}`].color;
    ENTITY[`b${destination[0]}${destination[1]}`].color = temp;

    temp = ENTITY[`b${activePos[0]}${activePos[1]}`].active;
    ENTITY[`b${activePos[0]}${activePos[1]}`].active =
      ENTITY[`b${destination[0]}${destination[1]}`].active;
    ENTITY[`b${destination[0]}${destination[1]}`].active = temp;

    temp = ENTITY[`b${activePos[0]}${activePos[1] - 1}`].color;
    ENTITY[`b${activePos[0]}${activePos[1] - 1}`].color =
      ENTITY[`b${destination[0]}${destination[1] - 1}`].color;
    ENTITY[`b${destination[0]}${destination[1] - 1}`].color = temp;

    temp = ENTITY[`b${activePos[0]}${activePos[1] - 1}`].active;
    ENTITY[`b${activePos[0]}${activePos[1] - 1}`].active =
      ENTITY[`b${destination[0]}${destination[1] - 1}`].active;
    ENTITY[`b${destination[0]}${destination[1] - 1}`].active = temp;
  }

  function render() {
    if (fields.length > 0) {
      const row = [];
      let column = [];

      for (let i = 0; i < HORIZONTAL; i++) {
        column = [];

        for (let j = 0; j < VERTICAL; j++) {
          fields[i][j].object
            ? column.push(fields[i][j].object)
            : column.push(<Square key={generateKey(`${i}${j}`)} i={i} j={j} />);
        }

        row.push(<View key={`view${i}`}>{column}</View>);
      }

      return <View style={styles.row}>{row}</View>;
    }
  }

  const onTapLeft = () => {
    if (
      activePos[0] > 0 &&
      !ENTITY[`b${activePos[0] - 1}${activePos[1]}`].color
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
      !ENTITY[`b${activePos[0] + 1}${activePos[1]}`].color
    ) {
      move([activePos[0] + 1, activePos[1]]);
      setActivePos([activePos[0] + 1, activePos[1]]);
    }

    console.log('move right', activePos[0], HORIZONTAL);
  };

  const Update = (entities, {touches}) => {
    // setCooldown(cooldown + 1);
    //
    // if (cooldown > SPEED) {
    //   setCooldown(0);
    //   dropActiveBlock();
    // }

    spawnBlock();
    check();

    return entities;
  };

  return (
    <>
      <GameEngine style={styles.engine} systems={[Update]} entities={ENTITY} />
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
