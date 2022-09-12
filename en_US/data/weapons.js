// import /en_US/data/json/weapons.json


angular.module('splatApp').weapons = function($scope) {
    $scope.weaponSets = weapons()
}


function weapons() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/weapons.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}