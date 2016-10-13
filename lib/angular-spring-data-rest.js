/* */ 
(function(process) {
  (function() {
    'use strict';
    angular.module("spring-data-rest", ["ngResource"]);
    angular.module("spring-data-rest").provider("SpringDataRestAdapter", function() {
      var config = {
        'linksKey': '_links',
        'linksHrefKey': 'href',
        'linksSelfLinkName': 'self',
        'embeddedKey': '_embedded',
        'embeddedNewKey': '_embeddedItems',
        'embeddedNamedResources': false,
        'resourcesKey': '_resources',
        'resourcesFunction': undefined,
        'fetchFunction': undefined,
        'fetchAllKey': '_allLinks',
        'baseUri': undefined
      };
      return {
        config: function(newConfig) {
          if (typeof newConfig !== 'undefined') {
            if (!angular.isObject(newConfig)) {
              throw new Error("The given configuration '" + newConfig + "' is not an object.");
            }
            if (newConfig.resourcesFunction != undefined && typeof(newConfig.resourcesFunction) != "function") {
              throw new Error("The given resource function '" + newConfig.resourcesFunction + "' is not of type function.");
            }
            if (newConfig.fetchFunction != undefined && typeof(newConfig.fetchFunction) != "function") {
              throw new Error("The given fetch function '" + newConfig.fetchFunction + "' is not of type function.");
            }
            config = deepExtend(config, newConfig);
          }
          return config;
        },
        $get: ["$injector", function($injector) {
          var linkMap = {};
          function resourcesFunction(url, paramDefaults, actions, options) {
            if (config.resourcesFunction == undefined) {
              return $injector.get("$resource")(url, paramDefaults, actions, options);
            } else {
              return config.resourcesFunction(url, paramDefaults, actions, options);
            }
          }
          function fetchFunction(url, key, data, fetchLinkNames, recursive) {
            if (config.fetchFunction == undefined) {
              var promisesArray = [];
              promisesArray.push($injector.get("$http").get(url).then(function(responseData) {
                if (recursive) {
                  return processData(responseData.data, fetchLinkNames, true).then(function(processedData) {
                    data[key] = processedData;
                  });
                } else {
                  return processData(responseData.data).then(function(processedData) {
                    data[key] = processedData;
                  });
                }
              }, function(error) {
                if (error.status != 404) {
                  return $injector.get("$q").reject(error);
                }
              }));
              return $injector.get("$q").all(promisesArray);
            } else {
              return config.fetchFunction(url, key, data, fetchLinkNames, recursive);
            }
          }
          var processData = function processDataFunction(promiseOrData, fetchLinkNames, recursive) {
            return $injector.get("$q").when(promiseOrData).then(function(data) {
              var resources = function(resourceObject, paramDefaults, actions, options) {
                var resources = this[config.linksKey];
                var resourcesRel = [];
                for(var j=0; j<resources.length; j++){
                  resourcesRel[j] = resources[j].rel;
                }
                var parameters = paramDefaults;
                var urlTemplates = "";
                if (hasUrlTemplate(resourceObject)) {
                  var extractedUrlTemplates = extractUrlTemplates(resourceObject);
                  resourceObject = extractedUrlTemplates[0];
                  urlTemplates = extractedUrlTemplates[1];
                }
                if (angular.isObject(resourceObject)) {
                  if (!resourceObject.name) {
                    throw new Error("The provided resource object must contain a name property.");
                  }
                  var resourceObjectParameters = resourceObject.parameters;
                  if (paramDefaults && angular.isObject(paramDefaults)) {
                    if (resourceObjectParameters && angular.isObject(resourceObjectParameters)) {
                      parameters = angular.extend(angular.copy(paramDefaults), angular.copy(resourceObjectParameters));
                    } else {
                      parameters = angular.copy(paramDefaults);
                    }
                  } else {
                    if (resourceObjectParameters && angular.isObject(resourceObjectParameters)) {
                      parameters = angular.copy(resourceObjectParameters);
                    }
                  }
                  angular.forEach(parameters, function(value, key) {
                    if (value === "") {
                      delete parameters[key];
                    }
                  });
                  return resourcesFunction(getProcessedUrl(data, resourceObject.name), parameters, actions, options);
                } else if (resourcesRel.indexOf(resourceObject) > -1) {
                  return resourcesFunction(getProcessedUrl(data, resourceObject) + urlTemplates, parameters, actions, options);
                }
                var availableResources = [];
                angular.forEach(resources, function(value, key) {
                  if (value.templated) {
                    var templateParameters = extractTemplateParameters(value[config.linksHrefKey]);
                    availableResources.push({
                      "name": key,
                      "parameters": templateParameters
                    });
                  } else {
                    availableResources.push({"name": key});
                  }
                });
                return availableResources;
              };
              if (data && data.data) {
                data = data.data;
              }
              if (!angular.isObject(data) || data instanceof Array) {
                return $injector.get("$q").reject("Given data '" + data + "' is not of type object.");
              }
              if (fetchLinkNames && !(fetchLinkNames instanceof Array || typeof fetchLinkNames === "string")) {
                return $injector.get("$q").reject("Given fetch links '" + fetchLinkNames + "' is not of type array or string.");
              }
              var processedData = undefined;
              var promisesArray = [];
              if (config.linksKey in data) {
                var resourcesObject = {};
                resourcesObject[config.resourcesKey] = resources;
                processedData = angular.extend(angular.copy(data), resourcesObject);
                if (fetchLinkNames != undefined) {
                  var self;
                  var links = data[config.linksKey];
                  for(var i=0; i<links.length; i++){
                    if(links[i].rel == config.linksSelfLinkName){
                      self = links[i][config.linksHrefKey];
                    }
                  }
                  if (!linkMap[self]) {
                    linkMap[self] = [];
                  }
                  angular.forEach(data[config.linksKey], function(linkValue, linkName) {
                    linkName = linkValue.rel;
                    if (linkName != config.linksSelfLinkName) {
                      if (linkMap[self].indexOf(linkName) < 0 && (fetchLinkNames == config.fetchAllKey || (typeof fetchLinkNames === "string" && linkName == fetchLinkNames) || (fetchLinkNames instanceof Array && fetchLinkNames.indexOf(linkName) >= 0))) {
                        promisesArray.push(fetchFunction(getProcessedUrl(data, linkName), linkName, processedData, fetchLinkNames, recursive));
                        linkMap[self].push(linkName);
                      }
                    }
                  });
                }
              }
              if (config.embeddedKey in data) {
                if (!processedData) {
                  processedData = angular.copy(data);
                }
                processedData = moveArray(processedData, config.embeddedKey, config.embeddedNewKey, config.embeddedNamedResources);
                angular.forEach(processedData[config.embeddedNewKey], function(value, key) {
                  if (value instanceof Array && value.length > 0) {
                    var processedDataArray = [];
                    var processedDataArrayPromise;
                    angular.forEach(value, function(arrayValue, arrayKey) {
                      if (angular.isObject(arrayValue)) {
                        processedDataArrayPromise = processDataFunction({data: arrayValue}, fetchLinkNames, recursive).then(function(processedResponseData) {
                          processedDataArray[arrayKey] = processedResponseData;
                        });
                        promisesArray.push(processedDataArrayPromise);
                      } else {
                        processedDataArray[arrayKey] = arrayValue;
                      }
                    });
                    if (processedDataArrayPromise) {
                      processedDataArrayPromise.then(function() {
                        processedData[config.embeddedNewKey][key] = processedDataArray;
                      });
                    }
                  } else if (angular.isObject(value)) {
                    promisesArray.push(processDataFunction({data: value}, fetchLinkNames, recursive).then(function(processedResponseData) {
                      processedData[config.embeddedNewKey][key] = processedResponseData;
                    }));
                  }
                });
              }
              return $injector.get("$q").all(promisesArray).then(function() {
                return processedData ? processedData : data;
              });
            });
            function getProcessedUrl(data, resourceName) {
              var links = data[config.linksKey];
              var url;
              for(var i=0; i<links.length; i++){
                if(links[i].rel == resourceName){
                  url = links[i][config.linksHrefKey];
                }
              }
              var rawUrl = checkUrl(url, resourceName, config.linksHrefKey);
              return extractUrl(rawUrl, config.baseUri);
            }
            function hasUrlTemplate(resourceName) {
              return typeof resourceName == "string" && resourceName.indexOf("/") > 0;
            }
            function extractUrlTemplates(resourceName) {
              if (hasUrlTemplate(resourceName)) {
                var indexOfSlash = resourceName.indexOf("/");
                return [resourceName.substr(0, indexOfSlash), resourceName.substr(indexOfSlash, resourceName.length)];
              }
            }
          };
          return {process: function(promiseOrData, fetchLinkNames, recursive) {
              linkMap = {};
              return processData(promiseOrData, fetchLinkNames, recursive);
            }};
        }]
      };
    });
    angular.module("spring-data-rest").provider("SpringDataRestInterceptor", ["$httpProvider", "SpringDataRestAdapterProvider", function($httpProvider) {
      return {
        apply: function() {
          $httpProvider.interceptors.push("SpringDataRestInterceptor");
        },
        $get: ["SpringDataRestAdapter", "$q", function(SpringDataRestAdapter, $q) {
          return {response: function(response) {
              if (!angular.isObject(response.data)) {
                return response;
              }
              return SpringDataRestAdapter.process(response.data).then(function(processedResponse) {
                response.data = processedResponse;
                return response;
              });
            }};
        }]
      };
    }]);
    function deepExtend(destination) {
      angular.forEach(arguments, function(obj) {
        if (obj !== destination) {
          angular.forEach(obj, function(value, key) {
            if (destination[key] && destination[key].constructor && destination[key].constructor === Object) {
              deepExtend(destination[key], value);
            } else {
              destination[key] = value;
            }
          });
        }
      });
      return angular.copy(destination);
    }
    function moveArray(object, sourceKey, destinationKey, useSameObject) {
      var embeddedObject = object[sourceKey];
      if (embeddedObject) {
        var processedData = {};
        processedData[destinationKey] = {};
        if (useSameObject === true) {
          angular.forEach(Object.keys(embeddedObject), function(key) {
            processedData[destinationKey][key] = embeddedObject[key];
          });
        } else {
          var key = Object.keys(embeddedObject)[0];
          processedData[destinationKey] = embeddedObject[key];
        }
        object = angular.extend(object, processedData);
        delete object[sourceKey];
      }
      return object;
    }
    function extractUrl(url, baseUri, templated) {
      if (templated) {
        url = removeTemplateParameters(url);
      }
      if(baseUri){
        url = baseUri + url;
      }
      return url;
    }
    function checkUrl(url, resourceName, hrefKey) {
      if (url == undefined || !url) {
        throw new Error("The provided resource name '" + resourceName + "' has no valid URL in the '" + hrefKey + "' property.");
      }
      return url;
    }
    function removeTemplateParameters(url) {
      return url.replace(/{.*}/g, '');
    }
    function extractTemplateParameters(url) {
      var templateParametersObject = {};
      var regexp = /{\?(.*)}/g;
      var templateParametersArray = regexp.exec(url)[1].split(',');
      angular.forEach(templateParametersArray, function(value) {
        templateParametersObject[value] = "";
      });
      return templateParametersObject;
    }
  })();
})(require('process'));
