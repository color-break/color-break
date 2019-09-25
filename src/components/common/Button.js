import React from 'react';
import {Dimensions, Text, TouchableOpacity} from 'react-native';

const {width} = Dimensions.get('window');

const Button = ({onPress, label}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  button: {
    width: width * 0.4,
    height: width * 0.1,
    backgroundColor: '#0000A0',
    marginBottom: width * 0.02,
    borderRadius: width * 0.02,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
};

export {Button};
