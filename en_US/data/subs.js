// import /en_US/data/json/subs.json


angular.module('splatApp').subs = function($scope) {
    $scope.subs = subs()
}


function subs() {
    // get json from /en_US/data/json/subs.json
    fetch('data/json/subs.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        })
}