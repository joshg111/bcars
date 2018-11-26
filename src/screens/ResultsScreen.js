import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, FlatList, Linking } from 'react-native'
import PropTypes from 'prop-types' // refer:http://t.cn/RF9vjQ2
import getCars from '../utils/GetCars'
import { observer, inject } from 'mobx-react'
import {FILTER_STATE} from '../stores/RootStore'
import TimeAgo from 'react-native-timeago';


class MyListItem extends React.PureComponent {

  rowStyle(percentage) {
    var res = {fontSize: 18, paddingLeft:10, paddingBottom:10, paddingRight:10};
    var color = "red";
    if (percentage <= 0) {
      color = "green"
    }

    res["color"] = color

    return res;
  }

  renderPercentage(percentage)
  {
    var modifierText = " above ";
    if (percentage <= 0 )
    {
      modifierText = " below ";
    }

    var percentageText = Math.abs(percentage).toString() + "%" + modifierText;
    percentageText += "kelley blue book"

    return (
      <Text style={this.rowStyle(percentage)}>
        {percentageText}
      </Text>
    );
  }

  listing_press(url) {
    Linking.openURL(url);
  }

  render() {
    var rowData = this.props.item;
    return (
    <View style={{flex:1, alignItems: 'center',margin: 10, backgroundColor: 'white',}}>
      <View style={{flex: 1,flexDirection: 'column', alignSelf: 'flex-start', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 22,paddingHorizontal: 10, paddingTop:10, fontWeight: 'bold'}}>
           ${rowData.price}
        </Text>
        <Text style={{fontSize: 22,paddingHorizontal: 10}}>
          {rowData.year} {rowData.kbbMake} {rowData.kbbModel}
        </Text>
        {this.renderPercentage(rowData.percentAboveKbb)}
      </View>

      <View style={{flex:1, alignSelf: 'stretch'}}>
        <Image
          style={{flex: 1, width: null, height: 400}}
          source={{ uri: rowData.thumbnail }}
          resizeMode='cover'
        />
      </View>


    <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'space-between', margin: 10}}>

        <View style={{flex: 1, flexDirection: 'row', marginBottom: 10, justifyContent: 'flex-start',flexWrap: 'wrap',}}>
          <View style={{flexDirection: 'row',}}>
            <Text style={{color:"blue"}}>Description: </Text>
            <Text>{rowData.desc ? rowData.desc : 'unknown'} </Text>
          </View>
          <View style={{flexDirection: 'row',}}>
            <Text style={{color:"blue"}}>Odometer: </Text>
            <Text>{rowData.odometer ? rowData.odometer : 'unknown'} </Text>
          </View>
          <View style={{flexDirection: 'row',}}>
            <Text style={{color:"blue"}}>Location: </Text>
            <Text>{rowData.location ? rowData.location : 'unknown'} </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color:"blue"}}>Posted: </Text>
            <TimeAgo time={rowData.timeago} />
          </View>
        </View>

        <View style={{flex:1, flexDirection: 'row',marginBottom: 10, justifyContent: 'space-evenly'}}>
          <Button
            onPress={this.listing_press.bind(this, rowData.craigsLink)}
            title='Go To Listing'
          />
          <Button
            onPress={this.listing_press.bind(this, rowData.kbbLink)}
            title='Go To KBB'
          />
        </View>

      </View>
    </View>
    );
  }
}


@inject("store")
@observer
class ResultsScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Results',
      headerRight: (
        <Button
          onPress={() => navigation.goBack()}
          title="Search"
        />
      ),
      headerRightContainerStyle: {marginHorizontal: 10}
    };
  };

  constructor(props) {
      super(props);
      this.state = { carData: [], loading: true};
    }

  async componentWillMount() {
    var store = this.props.store;
    params = {
      city: store.location,
      query: this.props.navigation.getParam('query', '')
    };
    for (var key in FILTER_STATE) {
      params[key] = store[key];
    }

    var carData = await getCars(params);
//     var carData = [{
//   "condition": "new",
//   "craigsLink": "https://sandiego.craigslist.org/csd/cto/d/honda-cr-2010/6744506842.html",
//   "cylinders": "4 cylinders",
//   "desc": "Honda crv",
//   "fuel": "gas",
//   "kbbLink": "https://www.kbb.com/honda/cr-v/2010/lx-sport-utility-4d/?vehicleid=261933&intent=buy-used&modalview=false&pricetype=private-party&condition=good",
//   "kbbMake": "Honda",
//   "kbbModel": "CR-V",
//   "kbbPrice": "7636",
//   "location": "(San diego)",
//   "max_auto_miles": "",
//   "max_auto_year": "",
//   "max_price": "",
//   "min_auto_miles": "",
//   "min_auto_year": "",
//   "min_price": "",
//   "percentAboveKbb": 49,
//   "price": "11400",
//   "query": "honda+cr-v",
//   "thumbnail": "https://images.craigslist.org/00h0h_cd0xMYDuani_1200x900.jpg",
//   "timeago": "2018-11-09T02:28:52-0800",
//   "title": "Honda CR-V 2010***",
//   "title status": "clean",
//   "transmission": "automatic",
//   "year": "2010",
// },
// {
//   "condition": "excellent",
//   "craigsLink": "https://sandiego.craigslist.org/csd/cto/d/honda-cr/6743649362.html",
//   "cylinders": "4 cylinders",
//   "desc": "honda cr-v",
//   "drive": "fwd",
//   "fuel": "gas",
//   "kbbLink": "https://www.kbb.com/honda/cr-v/2010/lx-sport-utility-4d/?vehicleid=261933&intent=buy-used&modalview=false&pricetype=private-party&condition=good",
//   "kbbMake": "Honda",
//   "kbbModel": "CR-V",
//   "kbbPrice": "7636",
//   "location": "(San diego)",
//   "max_auto_miles": "",
//   "max_auto_year": "",
//   "max_price": "",
//   "min_auto_miles": "",
//   "min_auto_year": "",
//   "min_price": "",
//   "percentAboveKbb": 51,
//   "price": "11500",
//   "query": "honda+cr-v",
//   "thumbnail": "https://images.craigslist.org/00D0D_hrXvWgGYjeN_600x450.jpg",
//   "timeago": "2018-11-08T00:25:02-0800",
//   "title": "Honda CR-V",
//   "title status": "clean",
//   "transmission": "automatic",
//   "year": "2010",
// }];


    // console.log("carData = ", carData);
    carData = carData.cars;
    this.setState({carData, loading: false});
  }

  renderItem({item}) {
    return (
      <MyListItem
        item={item}
      />
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column',}}>
          <Text style={{fontSize: 20,}}>Loading</Text>
          <Image source={require('../../3WFM.gif')} />
        </View>
      );
    }

    if (!this.state.carData) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column',}}>
          <Text style={{fontSize: 20,}}>Server Failure, try again</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.carData}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'silver',

  },
})
export default ResultsScreen
