import { observable, action, runInAction } from "mobx";
import { observer, inject } from 'mobx-react'
import { create, persist } from 'mobx-persist'
import { AsyncStorage } from 'react-native';


const INITIAL_STATE = {
  minPrice: "0",
  maxPrice: "20000",
  minYear: "2002",
  maxYear: "2018",
  minMiles: "0",
  maxMiles: "180000"
}

const hydrate = create({ storage: AsyncStorage })

class FilterScreenStore {

  @persist
  @observable
  minPrice = INITIAL_STATE.minPrice

  @persist
  @observable
  maxPrice = INITIAL_STATE.maxPrice

  @persist
  @observable
  minYear = INITIAL_STATE.minYear

  @persist
  @observable
  maxYear = INITIAL_STATE.maxYear

  @persist
  @observable
  minMiles = INITIAL_STATE.minMiles

  @persist
  @observable
  maxMiles = INITIAL_STATE.maxMiles

  @persist
  @observable
  location = "";

  constructor() {
    // this.getLocation().then((res) => runInAction(() => {this.location = res; console.log("loc", this.location)}))
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

    console.log("response = ", response);
    // res = response.headers.get('set-cookie').replace(/cl_def_hp=(.*?);.*/g, '$1');
    var regex = /:\/\/(.*?)\./;
    res = response.url.match(regex)[1]
    console.log("location = ", res);
  	return res;
  }

  @action
  async reset() {
    console.log("Resetting")
    this.minPrice = INITIAL_STATE.minPrice
    this.maxPrice = INITIAL_STATE.maxPrice
    this.minYear = INITIAL_STATE.minYear
    this.maxYear = INITIAL_STATE.maxYear
    this.minMiles = INITIAL_STATE.minMiles
    this.maxMiles = INITIAL_STATE.maxMiles
    this.location = await this.getLocation()
  }
}

var s = new FilterScreenStore();
s.reset().then(() => {hydrate('FilterScreenKey', s)})



export default s;
