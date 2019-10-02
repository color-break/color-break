/**
 * Game configuration.
 *
 * @author Effene Herry <effene.hrr@gmail.com>
 */

import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const BLOCKWIDTH = width / 9;
const TILES = {
  x: 5,
  y: 11,
};

export default {
  block: {
    width: BLOCKWIDTH,
    height: BLOCKWIDTH,
  },
  colors: [
    '#34c759', // Green
    '#5856d6', // Indigo
    '#ff9500', // Orange
  ],
  offset: {
    x: (width - BLOCKWIDTH * TILES.x) / 2,
    y: (height - BLOCKWIDTH * TILES.y) / 4,
  },
  tiles: TILES,
};
