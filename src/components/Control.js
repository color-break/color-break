import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Button} from './common';

const Control = () => {
  return (
    <View style={styles.container}>
      <Button />
      <Button />
      <Button />
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
  },
};

export default Control;
