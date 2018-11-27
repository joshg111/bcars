import React from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Button } from 'react-native';
import findAutocompletes from '../search/autocomplete'
import locations from '../search/locations'
import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import { observer, inject } from 'mobx-react'



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
@inject("store")
@observer
class Autocomplete extends React.Component {

  constructor(props) {
      super(props);
      this.state = { text: '', autocompletes: []};
    }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => this.textInput.focus());
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _onPressItem = (key) => {
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

  gotoResults() {
    this.props.navigation.navigate('Results', {
      query: this.state.text
    });
  }

  render() {
    return (
      <View style={[styles.autocomplete]}>
        <View style={{flexDirection: 'row'}}>
        <TextInput
          style={{flex: 8, height: 40, borderColor: 'purple', borderWidth: 1}}
          onChangeText={(text) => this.onChangeText(text)}
          value={this.state.text}
          placeholder='Toyota sedan'
          autoFocus={true}
          returnKeyType={'search'}
          onSubmitEditing={this.gotoResults.bind(this)}
          ref={(input) => this.textInput = input}
          editable={this.props.store.isValidLocation}
        />

        <TouchableOpacity
          style={{flex: 1}}
          onPress={this.gotoResults.bind(this)}
          disabled={!this.props.store.isValidLocation}
          >
          <MaterialIcons name="search" size={32} color="black" />
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

    </View>

    );
  }
}

@inject("store")
@observer
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

  renderLocationError() {
    if (!this.props.store.isValidLocation) {
      return (
        <Text style={{color: 'red',fontSize: 20,}}>Invalid City</Text>
      );
    }
    return null;
  }

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
      <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={100}>
        <View style={styles.subContainer}>
          {this.renderLocationError()}
          <View style={[{
              height: 35,
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start'},
              !this.props.store.isValidLocation ?
              {
                borderColor: 'red',
                borderBottomWidth: 2,
              } : null
            ]}>
            <Text style={{fontSize: 20, marginRight: 10}}>{this.props.store.location}</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Location')}>
              <MaterialIcons name="edit" size={32} color="black" />
            </TouchableOpacity>

          </View>
          <Autocomplete/>
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
  subContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginHorizontal: 40,
  },
  autocomplete: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  autoText: {
    fontSize: 22
  }
});
