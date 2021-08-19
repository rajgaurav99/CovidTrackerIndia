(function () {
  'use strict';
  angular.module("covid_tracker")
  .service('CovidService',CovidService);
    CovidService.$inject=['$http'];
    function CovidService($http) {
      var service=this;
      service.getdata=function () {
        return $http(
          {
            method:"GET",
            url:"https://api.rootnet.in/covid19-in/stats/latest"
          }
        )
        .then(function (result) {
          return result.data;
        });
      };


      service.getcontactdata=function () {
        return $http(
          {
            method:"GET",
            url:"https://api.rootnet.in/covid19-in/contacts"
          }
        )
        .then(function (result) {
          return result.data;
        });
      };

      service.getchartdata=function(){
        delete $http.defaults.headers.common['X-Requested-With'];
        return $http(
          {
            method:"GET",
            url:"https://api.covid19india.org/data.json"
          }
        )
        .then(function (result) {
          return result.data;
        });
      };

    }
})();
