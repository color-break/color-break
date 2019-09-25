import React, {useState} from 'react';
import {Dimensions, StatusBar, View} from 'react-native';
import {GameEngine, GameLoop} from 'react-native-game-engine';
import {Finger} from '../renderers';
import {MoveFinger} from '../systems';
import PlayField from '../components/PlayField';

const {width, height} = Dimensions.get('window');

const Square = ({position}) => {
  const square = {
    width: 50,
    height: 50,
    backgroundColor: 'yellow',
    position: 'absolute',
    left: position[0],
    top: position[1],
  };

  return <View style={square} />;
};

const Arena = () => {
  const [activeBlock, setActiveBlock] = useState(false);
  const [blocks, addBlocks] = useState([]);

  function spawnSquare(square) {
    if (!activeBlock) {
      setActiveBlock(true);
      square.position = [width / 2 - 25, 0];
    }
  }

  function dropSquare(square) {
    if (activeBlock && square.position[1] < height - 50) {
      square.position[1]++;
    }
  }

  function positionSquare(square) {
    if (activeBlock && square.position[1] === height - 50) {
      setActiveBlock(false);

      if (blocks.length === 0) {
        console.log('positioned');
        addBlocks(blck =>
          blck.concat({
            color: 'blue',
            position: [width / 2 - 25, 0],
          }),
        );
      }
    }
  }

  const Update = (entities, {touches}) => {
    spawnSquare(entities.active);
    dropSquare(entities.active);
    positionSquare(entities.active);

    return entities;
  };

  return (
    <GameEngine
      style={styles.container}
      systems={[Update]}
      entities={{
        active: {position: [40, 40], renderer: <Square />},
      }}>
      <StatusBar hidden={true} />
    </GameEngine>
  );
};

class MainScreen extends React.Component {
  render() {
    return <PlayField />;
  }
}

const styles = {
  container: {
    flex: 1,
  },
};

export default MainScreen;
