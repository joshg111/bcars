import {searchItems, car_data as carData} from './obj';
import Fuse from 'fuse.js';


function mapFuseToSearchResults(input) {
  return input.map((x) => {
    return new SearchResult(x.matches[0].value.toLowerCase(), x.matches[0].indices);
  });
}

function mapTextToSearchResults(input) {
  return input.map((x) => {
    return new SearchResult(x.toLowerCase(), []);
  });
}

class SearchResult {
  constructor(matchValue, indicies) {
    this.matchValue = matchValue
    this.indicies = indicies
  }

  getMatchValue() {
    return this.matchValue;
  }

  getIndicies() {
    return this.indicies;
  }
}


var options = {
  shouldSort: true,
  tokenize: true,
  includeMatches: true,
  includeScore: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {
      name: 'make',
      weight: 0.6
    },
    // {
    //   name: 'concat',
    //   weight: 0.5
    // },
   {
     name: 'model',
     weight: 0.4
   }
  ]
};

var fuse = new Fuse(searchItems, options);

/**
* param input: User input string
* param sources: List of sources
* return recommendations: List of rank sorted recommendations.
**/
function search(input, searches) {
  var ranks = [];
  var res = [];

  if(!input) {
    return res;
  }

  for(var search of searches) {
    // if(!search.source) {
    //   continue;
    // }

    var searchResults = search.matcher(search.source);

    for(var searchRes of searchResults) {
      ranks.push({searchRes, source: search.source});
    }

  }

  // ranks.sort((i, j) => i.fuseRes.score - j.fuseRes.score);
  // console.log("ranks = ", ranks);
  for(var rank of ranks) {
    res.push({kept: input.replace(new RegExp(rank.source + "$"), ''),
              replaced: rank.searchRes.getMatchValue(),
              indicies: rank.searchRes.getIndicies()});
  }
  return res;
}

/**
* Split the user input into potentially 2 words.
**/
export default async function findAutocompletes(input) {
  var result = [];

  var source = input.match(/[\s]*([^\s]+)[\s]+(\w*)$/i);
  if(source && source[1].toUpperCase() in carData) {
    if(!source[2]) {
      result = search(input, [{source: source[2], matcher: (x) => mapTextToSearchResults(carData[source[1].toUpperCase()])}]);
    }
    else {
      var modelFuse = new Fuse(carData[source[1].toUpperCase()], {...options, keys: null});
      result = search(input, [{source: source[2], matcher: (x) => mapFuseToSearchResults(modelFuse.search(x))}]);
    }

  }

  if(result == false) {
    source = input.match(/[\s]*([^\s]+)$/i);
    if(source) {
      result = result.concat(search(input, [{source: source[1], matcher: (x) => mapFuseToSearchResults(fuse.search(x))}]));
    }
  }

  // result = result.filter(function(item, pos) {
  //     return result.indexOf(item) == pos;
  // })

  var i = 0;
  for(var res of result) {
    i += 1;
    res['key'] = i;
  }

  return result;
}
