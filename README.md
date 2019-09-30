## About Color Break

Color Break is a game for Android & iOS using [React Native](https://facebook.github.io/react-native) and [React Native Game Engine](https://github.com/bberak/react-native-game-engine).

## Prerequisite

To develop the Color Break, you need to have [Node.js](https://nodejs.org) >= 12.10.0 and NPM >= 6.11.3 and each of these requirements:

### Android

1. [Android Studio](https://developer.android.com/studio).

### iOS

1. [Xcode](https://developer.apple.com/xcode).
2. [CocoaPods](https://cocoapods.org) (CocoaPods is a dependency manager for Swift and Objective-C Cocoa projects).

## Getting Started

First thing first, you can check the [React Native documentation](https://facebook.github.io/react-native/docs/getting-started) to install the dependencies required for Android / iOS development. If you already follow the guide, then you can start by running this command in your root project:

    npm install

## Troubleshoot

### Could not found iPhone X simulator

Currently, there is known issue for Xcode version 11 iPhone simulator. If you run `react-native run-ios` and got the error `Could not found iPhone X simulator`, you can either:

1. Create a new hardware profile and name it to `iPhone X` or
2. Change the `react-native run-ios` command to `react-native run-ios --simulator="iPhone 11"`

This problem exists, because the Xcode version 11 didn't include iPhone X as the part of hardware profile.

### 'React/RCTBridgeDelegate.h' file not found

You need to run `pod install` in the `ios` directory to install the missing dependencies. Or you can follow this [link](https://github.com/facebook/react-native/issues/25758) for the explanations.

### Error 'spawnSync ./gradlew EACCES'

This error happens because insufficient permissions in your android/gradlew. You can fix this by running `chmod 755 android/gradlew` in your root project ([source](https://stackoverflow.com/questions/54541734/spawnsync-gradlew-eacces-error-when-running-react-native-project-on-emulator-u)).

### Keystore file 'debug.keystore' not found

You need to download from [here](https://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystore) and put it to `android/app` directory.
