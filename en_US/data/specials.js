// import /en_US/data/json/specials.json


angular.module('splatApp').specials = function($scope) {
    $scope.specials = specials()
}



function specials() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/specials.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}