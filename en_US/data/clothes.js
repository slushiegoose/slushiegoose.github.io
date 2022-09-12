// import /en_US/data/json/clothes.json


angular.module('splatApp').clothes = function($scope) {
    $scope.clothes = clothes()
}


function clothes() {
    // get json from /en_US/data/json/clothes.json
    fetch('data/json/clothes.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        })
}