import React, {useState, useEffect} from 'react';
import {Dimensions, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import {Button} from './common';

const {width} = Dimensions.get('window');
const HORIZONTAL = 7;
const VERTICAL = 13;

const Square = ({color}) => {
  const style = {
    width: width / 9,
    height: width / 9,
    backgroundColor: color ? color : '#fff',
  };

  return <View style={style} />;
};

const createColor = () => {
  const colors = ['red', 'blue', 'green', 'yellow', null];
  const random = Math.floor(Math.random() * Math.floor(colors.length));
  return colors[random];
};

const PlayField = () => {
  const [fields, setFields] = useState([]);
  const [checkIteration, setCheckIteration] = useState(0);

  useEffect(() => {
    if (fields.length === 0) {
      const grid = [];

      for (let i = 0; i < HORIZONTAL; i++) {
        grid.push([]);
        for (let j = 0; j < VERTICAL; j++) {
          grid[i].push({
            pos: [i, j],
            object: <Square key={`${i}${j}`} color={createColor()} />,
          });
        }
      }

      setFields(grid);
    }
  }, [fields]);

  function check() {
    let row = [];
    let column = [];

    for (let i = 0; i < HORIZONTAL; i++) {
      column = [];

      for (let j = 0; j < VERTICAL; j++) {
        if (!fields[i][j].object.props.color) {
          reorder(i, j);
        }

        column.push(fields[i][j]);
      }

      row.push(column);
    }

    setFields(row);
  }

  function reorder(i, j) {
    if (j !== 0) {
      const temp = fields[i][j].object;
      fields[i][j].object = fields[i][j - 1].object;
      fields[i][j - 1].object = temp;
    }
  }

  function render() {
    if (fields.length > 0) {
      const row = [];
      let column = [];

      for (let i = 0; i < HORIZONTAL; i++) {
        column = [];

        for (let j = 0; j < VERTICAL; j++) {
          column.push(fields[i][j].object);
        }

        row.push(<View key={`view${i}`}>{column}</View>);
      }

      return <View style={styles.row}>{row}</View>;
    }
  }

  const Update = (entities, {touches}) => {
    check();

    return entities;
  };

  return (
    <>
      <GameEngine systems={[Update]} />
      {render()}
      <View style={styles.bottomMenu}>
        <Button label="drop" onPress={() => check()} />
      </View>
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
