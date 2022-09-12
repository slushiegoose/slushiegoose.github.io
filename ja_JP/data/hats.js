// import /en_US/data/json/hats.json

var HATS = undefined

angular.module('splatApp').hats = function($scope) {
    $scope.hats = HATS || hats()
}


function hats() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/hats.json", false)
    xhttp.send(null)
    HATS = JSON.parse(xhttp.responseText)
    return HATS
}