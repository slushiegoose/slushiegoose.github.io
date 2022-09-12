// import /en_US/data/json/specials.json


angular.module('splatApp').specials = function($scope) {
    $scope.specials = specials()
}


function specials() {
    // get json from /en_US/data/json/specials.json
    fetch('data/json/specials.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        })
}