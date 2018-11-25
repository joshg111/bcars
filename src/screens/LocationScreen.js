import React, { Component } from 'react'
import { KeyboardAvoidingView, View, Text, StyleSheet, Button, TextInput, TouchableOpacity, FlatList } from 'react-native'
import PropTypes from 'prop-types' // refer:http://t.cn/RF9vjQ2
import { observer, inject } from 'mobx-react'
import findAutocompletes from '../search/searchLocations'


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
          {this.styleReplaced()}
        </View>
      </TouchableOpacity>
    );
  }
}


@inject("store")
@observer
class LocationScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Location',
      headerRight: (
        <Button
          onPress={() => navigation.goBack()}
          title="Done"
        />
      ),
      headerRightContainerStyle: {marginHorizontal: 10}
    };
  };

  constructor(props) {
    super(props);
    console.log("loc = ", props.store.location);
    this.state = { text: props.store.location, autocompletes: []};
  }

  async componentWillMount() {
    this.setState({autocompletes: await findAutocompletes(this.props.store.location)})
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

    this.props.store.location = text;

    this.setState({autocompletes: await findAutocompletes(text)});

  }

  render() {
    return (
      <KeyboardAvoidingView style={[styles.container]} behavior='padding' keyboardVerticalOffset={100}>
        <View style={[styles.autocomplete]}>


          <TextInput
            style={{height: 40, borderColor: 'purple', borderWidth: 1}}
            onChangeText={this.onChangeText.bind(this)}
            value={this.props.store.location}
            placeholder='Craigslist city'
            autoFocus={true}
            returnKeyType={'done'}
            onSubmitEditing={() => this.props.navigation.goBack()}
            ref={(input) => this.textInput = input}
          />



          <FlatList
            style={{flex: 1}}
            data={this.state.autocompletes}
            keyExtractor = { (item, index) => index.toString() }
            renderItem={this._renderItem}
            keyboardShouldPersistTaps={'handled'}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>

    </KeyboardAvoidingView>

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
    marginTop: 10,
    marginHorizontal: 40
  },
  autoText: {
    fontSize: 22
  }
})
export default LocationScreen
