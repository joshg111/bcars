import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CarRouter from './src/router/CarRouter';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CarRouter/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
