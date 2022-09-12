// import /ja_JP/json/specials.json


angular.module('splatApp').specials = function($scope) {
    $scope.specials = specials()
}



function specials() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/ja_JP/data/json/specials.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}