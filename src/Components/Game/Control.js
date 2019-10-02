/**
 * Test control button area.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React from 'react';
import {Dimensions, View} from 'react-native';
import {Button} from '../Common';

const {width} = Dimensions.get('window');
const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: width * 0.2,
  },
};

export default ({moveLeft, moveDown, moveRight, rotate}) => {
  return (
    <View style={styles.container}>
      <Button style={styles.button} onPress={moveLeft}>
        Left
      </Button>
      <Button style={styles.button} onPress={moveDown}>
        Down
      </Button>
      <Button style={styles.button} onPress={moveRight}>
        Right
      </Button>
      <Button style={styles.button} onPress={rotate}>
        Rotate
      </Button>
    </View>
  );
};
