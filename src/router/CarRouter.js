import { createStackNavigator } from 'react-navigation';
import SearchScreen from '../screens/SearchScreen';
import FilterScreen from '../screens/FilterScreen';


export default createStackNavigator(
  {
    Search: SearchScreen,
    Filter: FilterScreen
  },
  {
    initialRouteName: 'Filter',
  }
);
