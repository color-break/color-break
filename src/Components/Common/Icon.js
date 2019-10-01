/**
 * Default icon component.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';

const {width} = Dimensions.get('window');

const Icon = ({style, src, onPress}) => {
  return (
    <TouchableOpacity style={{...styles.container, ...style}} onPress={onPress}>
      <Image style={styles.image} source={src} />
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    width: width * 0.05,
    height: width * 0.05,
  },
  image: {
    width: width * 0.05,
    height: width * 0.05,
  },
};

export {Icon};
