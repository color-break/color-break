import React from 'react';
import {Dimensions, View} from 'react-native';
import {Button} from './common';

const {width} = Dimensions.get('window');

const Control = ({moveLeft, moveDown, moveRight}) => {
  return (
    <View style={styles.container}>
      <Button style={styles.button} label="Left" onPress={moveLeft} />
      <Button style={styles.button} label="Down" onPress={moveDown} />
      <Button style={styles.button} label="Right" onPress={moveRight} />
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: width * 0.3,
  },
};

export default Control;

// *1 *1 = *2 = *3
// *1 *1 = *2 >
// *1 *1 = *2 >
