/**
 * Default button component.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const styles = {
  button: {
    height: 40,
    width: 80,
    backgroundColor: '#5856d6',
    borderRadius: 4,
    justifyContent: 'center',
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
};

const Button = ({onPress, style, ...props}) => {
  return (
    <TouchableOpacity style={{...styles.button, ...style}} onPress={onPress}>
      <Text style={styles.text}>{props.children}</Text>
    </TouchableOpacity>
  );
};

export {Button};
