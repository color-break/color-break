/**
 * Test control button area.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React from 'react';
import {Dimensions, View} from 'react-native';
import {Button} from './Common';

const {width} = Dimensions.get('window');
const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: width * 0.3,
  },
};

export default ({moveLeft, moveDown, moveRight}) => {
  return (
    <View style={styles.container}>
      <Button style={styles.button} label="Left" onPress={moveLeft} />
      <Button style={styles.button} label="Down" onPress={moveDown} />
      <Button style={styles.button} label="Right" onPress={moveRight} />
    </View>
  );
};
