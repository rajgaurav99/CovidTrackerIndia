(function () {
  'use strict';
  angular.module("covid_tracker",[])
  .controller("MainController",MainController)

  MainController.$inject=["CovidService"];

 function MainController(CovidService){
   var ctrl=this;
   var promise=CovidService.getdata();
   promise.then(function (response) {
     var statedata={};
     ctrl.coviddata=response.data.regional;
     for(var i=0;i<ctrl.coviddata.length;i++){
       var statename=ctrl.coviddata[i].loc;
       var statecode=statelist[statename];
       var totalConfirmed=ctrl.coviddata[i].totalConfirmed;
       statedata[statecode]={
         tooltip: {
           text: statename+': '+totalConfirmed,
           backgroundColor: 'white'
         },
         backgroundColor: '#'+(parseInt('ffe24f', 16)-totalConfirmed*4).toString(16),
         label: {
           visible: false
         }
       };
     }
     ctrl.summary=response.data.summary;
     var date=new Date(Date.parse(response.lastRefreshed))
     ctrl.lastRefreshed=date.toString();
     $(document).ready(function () {
    $('#statetable').DataTable({
    "scrollY": "50vh",
    "scrollCollapse": true,
    });
    $('.dataTables_length').addClass('bs-select');
    });
    show_map(statedata);
   })
   .catch(function (error) {
     console.log("Error in fetching the data from source");
   });
  }

})();
