import { observable, action, runInAction, extendObservable, computed } from "mobx";
import { observer, inject } from 'mobx-react'
import { create, persist } from 'mobx-persist'
import { AsyncStorage } from 'react-native';
import locations from '../search/locations'


// const INITIAL_STATE = {
//   min_price: "0",
//   max_price: "20000",
//   min_auto_year: "2002",
//   max_auto_year: "2018",
//   min_auto_miles: "0",
//   max_auto_miles: "180000",
//   location: ""
// }

export const FILTER_STATE = {
  min_price: "",
  max_price: "",
  min_auto_year: "",
  max_auto_year: "",
  min_auto_miles: "",
  max_auto_miles: ""
}

const SCHEMA = {
  min_price: true,
  max_price: true,
  min_auto_year: true,
  max_auto_year: true,
  min_auto_miles: true,
  max_auto_miles: true,
  location: true
}

const hydrate = create({ storage: AsyncStorage })

class FilterScreenStore {

  @observable
  loadingPersist = true;

  @observable
  location = ""

  constructor() {
    extendObservable(this, {...FILTER_STATE})
  }

  @computed
  get isValidLocation() {
    return locations.includes(this.location.toLowerCase());
  }

  @action.bound
  async getLocation() {
    let response;
    try {
      response = await fetch('https://geo.craigslist.org/');
    }
    catch(e) {
      throw e
    }

    // console.log("response = ", response);
    // console.log("headers = ", response.headers);
    // res = response.headers.get('set-cookie').replace(/cl_def_hp=(.*?);.*/g, '$1');
    var regex = /:\/\/(.*?)\./;
    res = response.url.match(regex)[1]
    console.log("location = ", res);
  	return res;
  }

  @action
  async setLocation() {
    this.location = await this.getLocation();
  }

  @action
  async reset() {
    // console.log("Resetting")
    for (key in FILTER_STATE) {
      this[key] = FILTER_STATE[key]
    }
    await this.setLocation();
  }
}

var s = new FilterScreenStore();
const persistStore = persist(SCHEMA)(s);
hydrate('FilterScreenKey', persistStore).then(() => {
  if (persistStore.location) {
    console.log("Location already set to = ", persistStore.location);
    persistStore.loadingPersist = false;
  }
  else {
    persistStore.setLocation().then(() => {
      persistStore.loadingPersist = false;
    });
  }

});

export default persistStore;
