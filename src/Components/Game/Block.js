/**
 * Game block component.
 *
 * @author Effene Herry <effene.hrr@gmail.com>
 */

import React from 'react';
import {Text, View} from 'react-native';

export default ({width, height, position, coordinate, color}) => {
  const style = {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: position[0],
    top: position[1],
    width: width,
    height: height,
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
