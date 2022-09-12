// import /en_US/data/json/hats.json


angular.module('splatApp').hats = function($scope) {
    $scope.hats = hats()
}


function hats() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/hats.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}