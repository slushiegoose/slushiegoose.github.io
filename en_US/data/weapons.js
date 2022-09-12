// import /en_US/data/json/weapons.json


angular.module('splatApp').weapons = function($scope) {
    $scope.weaponSets = weapons()
}


function weapons() {
    // get json from /en_US/data/json/weapons.json
    fetch('data/json/weapons.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        })
}