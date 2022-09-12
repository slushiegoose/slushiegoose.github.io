// import /en_US/data/json/shoes.json


angular.module('splatApp').shoes = function($scope) {
    $scope.shoes = shoes()
}


function shoes() {
    // get json from /en_US/data/json/shoes.json
    fetch('data/json/shoes.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        })
}