import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SearchScreen from '../screens/SearchScreen';
import FilterScreen from '../screens/FilterScreen';
import ResultsScreen from '../screens/ResultsScreen'
import LocationScreen from '../screens/LocationScreen'


export default createAppContainer(createStackNavigator(
  {
    Search: SearchScreen,
    Filter: FilterScreen,
    Results: ResultsScreen,
    Location: LocationScreen
  },
  {
    initialRouteName: 'Search',
  }
));
