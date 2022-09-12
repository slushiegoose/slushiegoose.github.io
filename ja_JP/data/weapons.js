// import /ja_JP/json/weapons.json


angular.module('splatApp').weapons = function($scope) {
    $scope.weaponSets = weapons()
}


function weapons() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/ja_JP/data/json/weapons.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}