import React, {useState, useEffect} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import {Button} from './common';

const {width} = Dimensions.get('window');
const HORIZONTAL = 7;
const VERTICAL = 13;
const SPEED = 0.00000000001;
const SPAWNPOINT = [Math.trunc(HORIZONTAL / 2), 1];

const Square = ({color, i, j, active}) => {
  const style = {
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 9,
    height: width / 9,
    backgroundColor: color ? color : '#fff',
  };

  return (
    <View style={style}>
      <Text>
        [{i}, {j}]
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

const PlayField = () => {
  const [fields, setFields] = useState([]);
  const [activeBlock, setActiveBlock] = useState(false);
  const [activePos, setActivePos] = useState(SPAWNPOINT);
  const [cooldown, setCooldown] = useState(0);

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
    if (!activeBlock && !fields[3][0].object && !fields[3][1].object) {
      setActiveBlock(true);
      fields[activePos[0]][activePos[1] - 1].object = (
        <Square key={generateKey('30')} color={createColor(true)} active />
      );
      fields[activePos[0]][activePos[1]].object = (
        <Square key={generateKey('31')} color={createColor(true)} active />
      );
    }
  };

  const dropActiveBlock = () => {
    const posBelow = activePos[1] + 1;
    if (
      activeBlock &&
      posBelow < VERTICAL &&
      !fields[activePos[0]][activePos[1] + 1].object
    ) {
      reorder(activePos[0], activePos[1]);
      reorder(activePos[0], activePos[1] - 1);
      setActivePos([activePos[0], activePos[1] + 1]);
    } else {
      setActiveBlock(false);
      setActivePos(SPAWNPOINT);
    }
  };

  const check = () => {
    let row = [];
    let column = [];

    for (let i = 0; i < HORIZONTAL; i++) {
      column = [];

      for (let j = 0; j < VERTICAL; j++) {
        if (
          j < VERTICAL - 1 &&
          fields[i][j].object &&
          !fields[i][j].object.props.active &&
          !fields[i][j + 1].object
        ) {
          reorder(i, j);
        }

        column.push(fields[i][j]);
      }

      row.push(column);
    }

    setFields(row);
  };

  function reorder(i, j) {
    const temp = fields[i][j].object;
    fields[i][j].object = fields[i][j + 1].object;
    fields[i][j + 1].object = temp;
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

  const Update = (entities, {touches}) => {
    if (cooldown > SPEED) {
      setCooldown(0);
      dropActiveBlock();
    }

    setCooldown(cooldown + 1);
    spawnBlock();
    check();

    return entities;
  };

  return (
    <>
      {render()}
      <View style={styles.bottomMenu}>
        <Button label="drop" onPress={() => check()} />
      </View>
      <GameEngine systems={[Update]} />
    </>
  );
};

const styles = {
  engine: {
    width: 0,
    height: 0,
    backgroundColor: 'green',
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
