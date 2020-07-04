(function () {
  'use strict';
  angular.module("covid_tracker",["ngRoute"])
  .config(function($routeProvider,$locationProvider){
	  var firebaseConfig = {
		apiKey: "AIzaSyB87tHf5S780nAp9LaeMcDBFsch4aOjo-Y",
		authDomain: "covid-19-tracker-2e275.firebaseapp.com",
		databaseURL: "https://covid-19-tracker-2e275.firebaseio.com",
		projectId: "covid-19-tracker-2e275",
		storageBucket: "covid-19-tracker-2e275.appspot.com",
		messagingSenderId: "383396418308",
		appId: "1:383396418308:web:4cb0a3730de3934013f651",
		measurementId: "G-NXBBCRF6PZ"
	  };
	  // Initialize Firebase
	  firebase.initializeApp(firebaseConfig);
	  firebase.analytics();
    $locationProvider.html5Mode(true);
    $routeProvider
    .when("/", {
        templateUrl : "main.html",
        controller: "MainController as ctrl"
    })
    .when("/helpline", {
        templateUrl : "helpline.html",
        controller : "HelplineController as ctrl"
    })
    .otherwise({
      templateUrl:"404.html"
    });
  })
  .controller("MainController",MainController)
  .controller("HelplineController",HelplineController)
  .component("covidnavbar",{
    templateUrl:"/components/navbar.html"
  })
  .component("footer",{
    templateUrl:"/components/footer.html"
  });

  MainController.$inject=["CovidService"];

 function MainController(CovidService){
   var ctrl=this;
   var promise=CovidService.getdata();
   promise.then(function (response) {
     var statedata={};
     ctrl.coviddata=response.data.regional;
     var max=0;
     for(var i=0;i<ctrl.coviddata.length;i++){
       if(ctrl.coviddata[i].totalConfirmed>max){
         max=ctrl.coviddata[i].totalConfirmed;
       }
     }
     for(var i=0;i<ctrl.coviddata.length;i++){
       var statename=ctrl.coviddata[i].loc;
       var statecode=statelist[statename];
       var totalConfirmed=ctrl.coviddata[i].totalConfirmed;
       statedata[statecode]={
         tooltip: {
           text: statename+': '+totalConfirmed,
           backgroundColor: 'white'
         },
         backgroundColor: "rgba(255, 99, 71,"+(0.2+totalConfirmed/max)+")" ,
         label: {
           visible: false
         }
       };
     }
     document.getElementById("grad").style.backgroundImage = "linear-gradient(to right, rgba(255,99,71,0.2) , rgba(255,99,71,1))";
     ctrl.summary=response.data["summary"];
     var date=new Date(Date.parse(response.lastRefreshed))
     ctrl.lastRefreshed=date.toString();
     $(document).ready(function () {
    $('#statetable').DataTable({
      "order": [[3,"desc"]],
    "scrollY": "50vh",
    "scrollCollapse": true,
    });
    $('.dataTables_length').addClass('bs-select');
    });
    show_map(statedata);
   })
   .catch(function (error) {
     console.log("Error in fetching the data from source");
     console.log(error);
   });
  }

  HelplineController.$inject=["CovidService"];
  function HelplineController(CovidService){
    var ctrl=this;
    ctrl.loading=true;
    var promise=CovidService.getcontactdata();
    promise.then(function(response){
      ctrl.loading=true;
      ctrl.data_primary=response.data.contacts.primary;
      ctrl.data_regional=response.data.contacts.regional;
      ctrl.loading=false;
    })
    .catch(function (error) {
      console.log("Error in fetching the data from source");
      console.log(error);
      ctrl.loading=false;
    });
  }

})();
