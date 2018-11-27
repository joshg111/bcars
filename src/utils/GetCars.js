// var AWS = require('aws-sdk');


async function getCars(params) {
  console.log(params);

  var res = null;
  try {
    res = await fetch('https://q62fhm3rwk.execute-api.us-east-1.amazonaws.com/dev/cars',
      {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(params)
      }
    );
  }
  catch(err) {
    console.log("Fetch lambda cars err = ", err);
    return null;
  }

  if (!res.ok) {
    console.log("Server failure");
    return null;
  }

  if(res !== null) {
    res = res.json();
  }

  console.log("res = ", res);

  return res;
}

// function get_cars(params) {
//   console.log("get_cars params = ", params);
//   return new Promise(function(resolve, reject) {
//     // AWS.config.loadFromPath('./aws-config.json');
//     AWS.config.update({accessKeyId: "abc",
//                       secretAccessKey: "123",
//                       region: "us-west-1"});
//
//     var lambda = new AWS.Lambda();
//     // create JSON object for parameters for invoking Lambda function
//     var pullParams = {
//       FunctionName : 'craigslist-kbb-dev-hello',
//       InvocationType : 'RequestResponse',
//       LogType : 'None',
//       Payload : JSON.stringify(params)
//     };
//
//     lambda.invoke(pullParams, function(error, data) {
//       if (error) {
//         reject(error)
//       } else {
//         resolve(data)
//       }
//     });
//   });
// }

export default getCars;
