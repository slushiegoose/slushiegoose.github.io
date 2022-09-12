// import /en_US/data/json/hats.json


angular.module('splatApp').hats = function($scope) {
    $scope.hats = hats()
}


function hats() {
    // get json from /en_US/data/json/hats.json
    fetch('data/json/hats.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        })
}