
import React from 'react';
import { Image, ScrollView, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Button } from 'react-native';
import { observer, inject } from 'mobx-react'


@inject("store")
@observer
class NumberInput extends React.Component {

  updateText(text) {
    text = text.replace(/[^0-9]/gi, '');
    this.props.store[this.props.state] = text;
  }

  render() {
    return (
      <View style={numStyles.container}>
        <Text style={{backgroundColor: 'white', alignSelf: 'center', fontSize: 16,}}>
          {this.props.name}
        </Text>
        <TextInput
          style={{backgroundColor: 'white', height: 40}}
          keyboardType = 'numeric'
          placeholder={this.props.placeholder}
          value={this.props.store[this.props.state]}
          onChangeText={this.updateText.bind(this)}
        />
      </View>
    );
  }

}

const numStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 20
  },
});


@inject("store")
@observer
export default class FilterScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Filter',
      headerRight: (
        <Button
          onPress={() => navigation.goBack()}
          title="Done"
        />
      ),
      headerRightContainerStyle: {marginHorizontal: 10}
    };
  };


  render() {
    if (this.props.store.loadingPersist) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column',}}>
          <Text style={{fontSize: 20,}}>Loading</Text>
          <Image source={require('../../3WFM.gif')} />
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container} keyboardVerticalOffset={100} enabled>
        <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={[styles.filterCard]}>
          <Text style={styles.filterTitle}>Price</Text>
          <View style={styles.subGroup}>
            <NumberInput state="min_price" placeholder="0" name="Min"/>
            <NumberInput state="max_price" placeholder="8000" name="Max"/>
          </View>
        </View>

        <View style={[styles.filterCard]}>
          <Text style={[styles.filterTitle]}>Year</Text>
          <View style={styles.subGroup}>
            <NumberInput state="min_auto_year" placeholder="2000" name="Min"/>
            <NumberInput state="max_auto_year" placeholder="2018" name="Max"/>
          </View>
        </View>

        <View style={[styles.filterCard]}>
          <Text style={[styles.filterTitle]}>Miles</Text>
          <View style={styles.subGroup}>
            <NumberInput state="min_auto_miles" placeholder="0" name="Min"/>
            <NumberInput state="max_auto_miles" placeholder="150000" name="Max"/>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <Button
            onPress={() => this.props.navigation.goBack()}
            title="Done"
          />
        </View>
        <View style={{marginVertical: 20}}>
          <Button
            onPress={() => this.props.store.reset()}
            title="Reset"
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginHorizontal: 20
  },
  filterCard: {
    height: 120,
    backgroundColor: 'white',
    marginTop: 20,
    padding: 5
  },
  filterTitle: {
    fontSize: 22,
  },
  subGroup: {
    flex: 1,
    flexDirection: 'row'
  }
});
