import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CarRouter from './src/router/CarRouter';
import RootStore from './src/stores/RootStore';
import { Provider } from 'mobx-react';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={RootStore}>
        <View style={styles.container}>
          <CarRouter/>
        </View>
      </Provider>
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
