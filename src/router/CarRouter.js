import { createStackNavigator } from 'react-navigation';
import SearchScreen from '../screens/SearchScreen';
import FilterScreen from '../screens/FilterScreen';
import ResultsScreen from '../screens/ResultsScreen'


export default createStackNavigator(
  {
    Search: SearchScreen,
    Filter: FilterScreen,
    Results: ResultsScreen
  },
  {
    initialRouteName: 'Search',
  }
);
