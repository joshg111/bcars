import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types' // refer:http://t.cn/RF9vjQ2

class ResultsScreen extends Component {

  static navigationOptions = {
      title: 'Results',
    };

  static propTypes = {
    // TODO
  }

  static defaultProps = {}

  render() {
    return (
      <View style={styles.container}>
        <Text>I am the ResultsScreen component</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
export default ResultsScreen
