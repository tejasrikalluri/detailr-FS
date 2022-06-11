//Simple error handling
function displayErr(error, client) {
  let message = error;
  $("#msg").html("");
  client.interface.trigger("showNotify", {
    type: "error",
    message: "Error: " + message,
  });
}
var formatRequesterData = function (requesterData, cust_field, callback) {
  let custArr = [];
  $.each(requesterData, function (key, val) {
    if (val !== null) {
      let newVal;
      switch (key) {
        case "department_names":
        case "company_names":
          newVal = showCompany_ticketPage(val);
          break;
        case "created_at":
        case "updated_at":
          newVal = showcreatedDate_ticketPage(val);
          break;
        case "custom_field":
          newVal = formatCustomFields(
            requesterData.result.custom_fields,
            cust_field,
            custArr
          );
          break;
        default:
          newVal = val;
          break;
      }
      requesterData[key] = newVal;
    }
  });
  callback(requesterData);
};
//Set values and shows respective divs
function setValues(configParams, requesterData, newFlag, cust_field) {
  if (newFlag === false) {
    $("#msg,#load").empty();
    $("#div-fields").show();
  }
  let numberOfFieldsDisplayed = 0;
  let paramsPrefix = "contact_";
  let custArr = [];
  $.each(requesterData.result, function (key, val) {
    if (key == "custom_fields") {
      var newValue = formatCustomFields(
        requesterData.result.custom_fields,
        cust_field,
        custArr
      );
      $("#contact_custom_field").html(newValue);
    }
    if (
      configParams[
        paramsPrefix + (key === "company_names" ? "department_names" : key)
      ] === true
    ) {
      $("#div-" + key).removeClass("hidden");
      if (isValNotEmpty(val)) {
        $("#" + paramsPrefix + key).html(val);
      }
      numberOfFieldsDisplayed++;
    }
  });
  if (numberOfFieldsDisplayed === 0) {
    if (newFlag === false) {
      $("#div-empty").removeClass("hidden");
      $("#msg,#load").empty();
    }
  }
}

function showCompany_ticketPage(val) {
  if (Array.isArray(val) && val.length) {
    var newVal = formatArrayString(val);
    return newVal;
  }
}

function showcreatedDate_ticketPage(val) {
  if (isISODate(val)) {
    var newVal = formatDate(val);
    return newVal;
  }
}
$(document).ready(function () {
  app.initialized().then(
    function (_client) {
      let client = _client;
      $("#errorDiv").hide();
      var getConfigurationParams = function (callback) {
        client.iparams
          .get()
          .then(function (data) {
            var fieldObj = {};
            fieldObj.obj = data.obj;
            fieldObj.cust_field = data.cust_field;
            callback(null, fieldObj);
            if (!fieldObj) {
              throw new Error(
                "We were not able to retrieve your configuration, please check your installation settings or reinstall app."
              );
            }
          })
          .catch(function (error) {
            callback(error);
          });
      };
      var getRequesterData = function (callback) {
        client.data
          .get("requester")
          .then(function (data) {
            var req_data = data.requester;
            let email = req_data.email;
            var options = {
              email: btoa(email),
            };
            client.request.invoke("searchRequester", options).then(
              function (data) {
                var requiredData = data.response.finalResult;
                if (
                  requiredData === null ||
                  Object.keys(requiredData).length == 0
                ) {
                  client.request.invoke("searchAgent", options).then(
                    function (data) {
                      var requiredData1 = data.response.finalResult;
                      if (requiredData1 === null) {
                        $("#msg").html("");
                        $("#errorDiv").show();
                      } else {
                        callback(requiredData1);
                      }
                    },
                    function () {
                      displayErr(
                        "Unexpected error occurred, please try after some time.",
                        client
                      );
                    }
                  );
                } else {
                  callback(requiredData);
                }
              },
              function () {
                displayErr(
                  "Unexpected error occurred, please try after some time.",
                  client
                );
              }
            );
          })
          .catch(function () {
            displayErr(
              "Unexpected error occurred, please try after some time.",
              client
            );
          });
      };
      var getReqDetail = function (email, callback) {
        var options = {
          email: btoa(email),
        };
        client.request.invoke("searchRequester", options).then(
          function (data) {
            var requiredData = data.response.finalResult;
            if (requiredData === null) {
              $("#msg").html("");
              $("#errorDiv").show();
            } else {
              callback(requiredData);
            }
          },
          function () {
            displayErr(
              "Unexpected error occurred, please try after some time.",
              client
            );
          }
        );
      };
      var getAgentDetail = function (email, callback) {
        let options = {
          email: btoa(email),
        };
        client.request.invoke("searchAgent", options).then(
          function (data) {
            var requiredData = data.response.finalResult;
            if (requiredData === null) {
              $("#msg").html("");
              $("#errorDiv").show();
            } else {
              callback(requiredData);
            }
          },
          function () {
            displayErr(
              "Unexpected error occurred, please try after some time.",
              client
            );
          }
        );
      };
      var getLocation = function (val, callback) {
        var options = {
          id: btoa(val),
        };
        client.request.invoke("getLocation", options).then(
          function (data) {
            var name = data.response.result;
            if (name === null) {
              $("#msg").html("");
              $("#errorDiv").show();
            } else {
              callback(name);
            }
          },
          function () {
            displayErr(
              "Unexpected error occurred, please try after some time.",
              client
            );
          }
        );
      };
      var getDepartment = function (depart_id, callback) {
        var options = {
          id: btoa(depart_id)
        };
        client.request.invoke("getDepartment", options).then(
          function (data) {
            var name = data.response.result;
            if (name === null) {
              $("#msg").html("");
              $("#errorDiv").show();
            } else {
              callback(name);
            }
          },
          function () {
            displayErr(
              "Unexpected error occurred, please try after some time.",
              client
            );
          }
        );
      };
      var getAppLocation = function (callback) {
        client.instance.context().then(
          function (context) {
            var location = context.location;
            callback(location);
          },
          function () {
            displayErr(
              "Unexpected error occurred, please try after some time.",
              client
            );
          }
        );
      };

      function process(count, val, d_size, nameArr) {
        if (count < d_size) {
          getDepartment(val[count], function (name) {
            nameArr.push(name);
            var num = count;
            num = num + 1;
            process(num, val, d_size, nameArr);
          });
        } else {
          $("#contact_department_names").html(nameArr.join(", "));
        }
      }

      function showData_newTicketPage(location, configParams, cust_field) {
        if (location === "new_ticket_sidebar") {
          $("#msg").html("Please Select Requester");
          $("#load").empty();
          var propertyChangeCallback = function (event) {
            var event_data = event.helper.getData();
            var req_email = event_data.new;
            $("#contact_department_names").html("N/A");
            $("#contact_location_name").html("N/A");
            $("#contact_address").html("N/A");
            $("#contact_job_title").html("N/A");
            $("#msg").html("Loading, please wait...");
            $("#div-fields").hide();
            getReqDetail(req_email, function (reqdata) {
              if (reqdata.result !== undefined) {
                $(
                  "#div-department_names,#div-company_names,#div-address"
                ).show();
                displayFields(configParams, reqdata, cust_field);
              } else {
                getAgentDetail(req_email, function (agentdata) {
                  $(
                    "#div-department_names,#div-company_names,#div-address"
                  ).hide();
                  displayFields(configParams, agentdata, cust_field);
                });
              }
            });
          };
          client.events.on("ticket.requesterChanged", propertyChangeCallback);
        }
      }

      function showData_TicketDetailPage(location, configParams, cust_field) {
        if (
          location === "ticket_requester_info" ||
          location === "contact_sidebar"
        ) {
          getRequesterData(function (req_data) {
            formatRequesterData(req_data, cust_field, function (data) {
              if (configParams.contact_custom_field === true) {
                var flag = true;
                setValues(configParams, data, flag, cust_field);
              } else {
                var flag = false;
                setValues(configParams, data, flag, cust_field);
              }
            });
          });
        }
      }
      client.events.on(
        "app.activated",
        function () {
          $("#msg").html("Loading, please wait...");
          $("#div-fields").hide();
          getConfigurationParams(function (error, data) {
            if (error) {
              displayErr(
                "Unexpected error occurred, please try after some time.",
                client
              );
            } else {
              var configParams = data.obj;
              var cust_field = data.cust_field;
              var flag = checkselectedFields(configParams);
              if (!flag) {
                $("#div-empty").removeClass("hidden");
                $("#msg,#load").empty();
              } else {
                $("#div-empty").empty();
                getAppLocation(function (location) {
                  showData_TicketDetailPage(location, configParams, cust_field);
                  showData_newTicketPage(location, configParams, cust_field);
                });
              }
            }
          });
        },
        function () {
          displayErr(
            "Unexpected error occurred, please try after some time.",
            client
          );
        }
      );

      function checkselectedFields(configParams) {
        if (Object.values(configParams).indexOf(true) > -1) {
          return true;
        } else {
          return false;
        }
      }

      function displayFields(configParams, reqData, cust_field) {
        $("#div-fields").show();
        $("#msg,#load").empty();
        var paramsPrefix = "contact_";
        let custArr = [];
        $.each(reqData.result, function (key, val) {
          if (configParams[paramsPrefix + key] === true) {
            showDefault(paramsPrefix, key, val);
          }
          showName(key, configParams, val);
          showEmail(key, configParams, val);
          showWorkPhone(key, configParams, val);
          showMobilePhone(key, configParams, val);
          showCustFields(reqData.result.custom_fields, cust_field, custArr);
          showDepartments(key, configParams, val);
          showLocation(key, configParams, val);
        });
      }

      function showDefault(paramsPrefix, key, val) {
        $("#div-" + key).removeClass("hidden");
        if (isValNotEmpty(val)) {
          if (isISODate(val)) {
            let newVal = formatDate(val);
            $("#" + paramsPrefix + key).html(xss_test(newVal));
          } else {
            $("#" + paramsPrefix + key).html(xss_test(val));
          }
        }
      }

      function showName(key, configParams, val) {
        if (key === "first_name") {
          if (configParams["contact_name"] === true) {
            $("#div-name").removeClass("hidden");
            if (isValNotEmpty(val)) {
              var fn = val;
              $("#contact_name").html(xss_test(fn));
            }
          }
        }
      }

      function showEmail(key, configParams, val) {
        if (key === "primary_email" || key === "email") {
          if (configParams["contact_email"] === true) {
            $("#div-email").removeClass("hidden");
            if (isValNotEmpty(val)) {
              $("#contact_email").html(xss_test(val));
            }
          }
        }
      }

      function showWorkPhone(key, configParams, val) {
        if (configParams["contact_phone"] === true) {
          if (key === "work_phone_number") {
            $("#div-phone").removeClass("hidden");
            if (val !== "" && val !== null && val !== undefined) {
              $("#contact_phone").html(xss_test(val));
            } else {
              $("#contact_phone").html("N/A");
            }
          }
        }
      }

      function showMobilePhone(key, configParams, val) {
        if (configParams["contact_mobile"] === true) {
          $("#div-mobile").removeClass("hidden");
          if (key === "mobile_phone_number") {
            if (val !== "" && val !== null && val !== undefined) {
              $("#contact_mobile").html(xss_test(val));
            } else {
              $("#contact_mobile").html("N/A");
            }
          }
        }
      }

      function showCustFields(val, cust_field, custArr) {
        custArr = [];
        var newValue = formatCustomFields(val, cust_field, custArr);
        $("#contact_custom_field").html(newValue);
      }

      function showDepartments(key, configParams, val) {
        if (configParams["contact_department_names"] === true) {
          if (key === "department_ids") {
            $("#div-department_names").removeClass("hidden");
            if (Array.isArray(val) && val.length > 0) {
              var nameArr = [];
              var count = 0;
              process(count, val, val.length, nameArr);
            }
          }
        }
      }

      function showLocation(key, configParams, val) {
        if (configParams["contact_location_name"] === true) {
          $("#div-location_name").removeClass("hidden");
          if (key === "location_id") {
            if (val !== null && val !== "" && val !== undefined) {
              getLocation(val, function (location) {
                $("#contact_location_name").html(location);
              });
            }
          }
        }
      }
    },
    function () {
      displayErr(
        "Unexpected error occurred, please try after some time.",
        client
      );
    }
  );
});
