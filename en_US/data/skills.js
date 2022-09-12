// import /en_US/data/json/skills.json


angular.module('splatApp').skills = function($scope) {
    $scope.skills = skills()
}


function skills() {
    // get json from /en_US/data/json/skills.json
    fetch('data/json/skills.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        })
}