/**
 * Default input component.
 *
 * @author Hubert Ganda <hubertganda@gmail.com>
 */

import React from 'react';
import {Dimensions, TextInput, View} from 'react-native';
import {Icon} from './Icon';

const {width} = Dimensions.get('window');

const Input = ({placeholder, value, onChangeText, password, icon, iconTap}) => {
  function showIcon() {
    if (icon) {
      return <Icon style={styles.icon} src={icon} onPress={iconTap} />;
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={password}
      />
      {showIcon()}
    </View>
  );
};

const styles = {
  container: {
    width: width * 0.4,
    height: width * 0.1,
    flexDirection: 'row',
    borderWidth: width * 0.002,
    borderRadius: width * 0.02,
    marginBottom: width * 0.02,
  },
  input: {
    flex: 1,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    textAlign: 'left',
  },
  icon: {
    marginRight: width * 0.02,
    marginTop: width * 0.025,
  },
};

export {Input};
