var base64 = require("base-64");
const domain = base64.decode(args.iparams.domain);
const apiKey = base64.decode(args.iparams.api_key);

exports = {
  searchAgent: function (args) {
    var email = base64.decode(args.email);
    var url = "https://" + domain + "/api/v2/agents?email=" + email;
    var headers = {
      Authorization: "Basic " + base64.encode(apiKey + ":X"),
      "Content-Type": "application/json",
    };
    var reqData = {
      headers: headers,
    };
    $request.get(url, reqData).then(
      function (data) {
        var result = JSON.parse(data.response).agents;
        if (result.length === 0) {
          let requiredData = {};
          requiredData["result"] = undefined;
          renderData(null, {
            finalResult: requiredData,
          });
        } else {
          getContactCustomFieldsLabel(args, result);
        }
      },
      function () {
        renderData(null, {
          finalResult: null,
        });
      }
    );
  },
  searchRequester: function (args) {
    var email = base64.decode(args.email);
    var url = "https://" + domain + "/api/v2/requesters?email=" + email;
    var headers = {
      Authorization: "Basic " + base64.encode(apiKey + ":X"),
      "Content-Type": "application/json",
    };
    var reqData = {
      headers: headers,
    };
    $request.get(url, reqData).then(
      function (data) {
        var result = JSON.parse(data.response).requesters;
        if (result.length === 0) {
          let requiredData = {};
          requiredData["result"] = undefined;
          renderData(null, {
            finalResult: requiredData,
          });
        } else {
          getContactCustomFieldsLabel(args, result);
        }
      },
      function () {
        renderData(null, {
          finalResult: null,
        });
      }
    );
  },
  getDepartment: function (args) {
    var id = base64.decode(args.id);
    var url = "https://" + domain + "/api/v2/departments/" + id;
    var headers = {
      Authorization: "Basic " + base64.encode(apiKey + ":X"),
      "Content-Type": "application/json",
    };
    var reqData = {
      headers: headers,
    };
    $request.get(url, reqData).then(
      function (data) {
        var result = JSON.parse(data.response);
        var name = result.department.name;
        renderData(null, {
          result: name,
        });
      },
      function () {
        renderData(null, {
          finalResult: null,
        });
      }
    );
  },
  getLocation: function (args) {
    var id = base64.decode(args.id);
    var url = "https://" + domain + "/api/v2/locations/" + id;
    var headers = {
      Authorization: "Basic " + base64.encode(apiKey + ":X"),
      "Content-Type": "application/json",
    };
    var reqData = {
      headers: headers,
    };
    $request.get(url, reqData).then(
      function (data) {
        var result = JSON.parse(data.response);
        var name = result.location.name;
        renderData(null, {
          result: name,
        });
      },
      function () {
        renderData(null, {
          finalResult: null,
        });
      }
    );
  },
};

function getContactCustomFieldsLabel(args, result) {
  var requiredData = {};
  var personDetails = result[0];
  var url = "https://" + domain + "/api/v2/requester_fields";
  var headers = {
    Authorization: "Basic " + base64.encode(apiKey + ":X"),
    "Content-Type": "application/json",
  };
  var reqData = {
    headers: headers,
  };
  $request.get(url, reqData).then(
    function (data) {
      var result = JSON.parse(data.response).requester_fields;
      var labelValueObj = {};
      for (let i = 0; i < result.length; i++) {
        if (result[i].default === false) {
          let contactFieldVal = personDetails.custom_fields[result[i].name];
          if (
            contactFieldVal !== null &&
            contactFieldVal !== undefined &&
            contactFieldVal !== ""
          ) {
            labelValueObj[result[i].label] = contactFieldVal;
          } else {
            labelValueObj[result[i].label] = "N/A";
          }
        }
      }
      requiredData["result"] = personDetails;
      requiredData["labelValueObj"] = labelValueObj;
      renderData(null, {
        finalResult: requiredData,
      });
    },
    function () {
      renderData(null, {
        finalResult: null,
      });
    }
  );
}
