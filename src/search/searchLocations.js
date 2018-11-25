import locations from './locations';
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
  keys: undefined
};


var fuse = new Fuse(locations, options);

/**
* param input: User input string
* param sources: List of sources
* return recommendations: List of rank sorted recommendations.
**/
function mapSearchResults(searchResults) {
  var res = [];

  for(var searchResult of searchResults) {
    res.push({replaced: searchResult.getMatchValue(),
              indicies: searchResult.getIndicies()});
  }
  return res;
}

/**
* Split the user input into potentially 2 words.
**/
export default async function findAutocompletes(input) {
  var result = [];

  console.log("input = ", input);

  var mapRes;
  if (input) {
    var fuseRes = fuse.search(input)
    mapRes = mapFuseToSearchResults(fuseRes)
  }
  else {
    mapRes = mapTextToSearchResults(locations)
  }

  result = mapSearchResults(mapRes);

  var i = 0;
  for(var res of result) {
    i += 1;
    res['key'] = i;
  }

  if (!result) {
    result
  }

  return result;
}
