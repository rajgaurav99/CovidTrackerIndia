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
     ctrl.summary=response.data.summary;
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

})();
