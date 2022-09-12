// import /ja_JP/json/hats.json


angular.module('splatApp').hats = function($scope) {
    $scope.hats = hats()
}


function hats() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/ja_JP/data/json/hats.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}