import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Button } from 'react-native';
import findAutocompletes from '../search/autocomplete'
import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';



class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.kept + this.props.replaced);
  };

  styleReplaced() {
    var res = [];
    var flattenIndicies = [];
    for(var indicie of this.props.indicies) {
      for(var i = indicie[0]; i <= indicie[1]; i++) {
        flattenIndicies.push(i)
      }
    }
    for(var i = 0; i < this.props.replaced.length; i++) {
      var styledText = [styles.autoText];
      if(!(i in flattenIndicies)) {
        styledText.push({fontWeight: 'bold'})
      }

      res.push(
        <Text
          key={i}
          style={styledText}>
            {this.props.replaced[i]}
        </Text>
      );
    }

    return res;
  }

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={{flexDirection: 'row', margin: 10}}>
          <Text style={styles.autoText}>
            {this.props.kept}
          </Text>
          {this.styleReplaced()}
        </View>
      </TouchableOpacity>
    );
  }
}

@withNavigation
class Autocomplete extends React.Component {

  constructor(props) {
      super(props);
      this.state = { text: '', autocompletes: []};
    }

  _onPressItem = (key) => {
    // this.setState({text: key});
    this.onChangeText(key);
    this.textInput.focus();
  };

  _renderItem = ({item}) => {
    return (
      <MyListItem
        onPressItem={this._onPressItem}
        kept={item.kept}
        replaced={item.replaced}
        indicies={item.indicies}
      />
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",

        }}
      />
    );
  };


  async onChangeText(text) {
    this.setState({text});
    this.setState({autocompletes: await findAutocompletes(text)});

  }

  render() {



    return (
      <KeyboardAvoidingView style={styles.autocomplete} behavior='padding' keyboardVerticalOffset={100}>

        <View style={{flexDirection: 'row'}}>
        <TextInput
          style={{flex: 8, height: 40, borderColor: 'purple', borderWidth: 1}}
          onChangeText={(text) => this.onChangeText(text)}
          value={this.state.text}
          placeholder='Toyota sedan'
          autoFocus={true}
          returnKeyType={'search'}
          onSubmitEditing={() => console.log('hi')}
          ref={(input) => this.textInput = input}
        />

        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => this.props.navigation.navigate('Results')}
          >
          <MaterialIcons  name="search" size={32} color="black" />
        </TouchableOpacity>

        </View>

        <FlatList
          style={{flex: 1}}
          data={this.state.autocompletes}
          keyExtractor = { (item, index) => index.toString() }
          renderItem={this._renderItem}
          keyboardShouldPersistTaps={'handled'}
          ItemSeparatorComponent={this.renderSeparator}
        />

      </KeyboardAvoidingView>

    );
  }
}

export default class SearchScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Search',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Filter')}
          title="Filter"
        />
      ),
      headerRightContainerStyle: {margin: 10}
    };
  };

  render() {
    console.log(this.props.navigation);
    return (
      <View style={styles.container}>

          <Autocomplete/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  autocomplete: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 40,
    marginHorizontal: 40
  },
  autoText: {
    fontSize: 22
  }
});
