import { observable } from "mobx";
import { observer, inject } from 'mobx-react'
import { create, persist } from 'mobx-persist'
import { AsyncStorage } from 'react-native';



const hydrate = create({ storage: AsyncStorage })

class FilterScreenStore {

  @persist
  @observable
  minPrice = "0"

  @persist
  @observable
  maxPrice = "20000"

  @persist
  @observable
  minYear = "2002"

  @persist
  @observable
  maxYear = "2018"

  @persist
  @observable
  minMiles = "0"

  @persist
  @observable
  maxMiles = "180000"
}

var s = new FilterScreenStore();

hydrate('FilterScreenKey', s);

export default s;
