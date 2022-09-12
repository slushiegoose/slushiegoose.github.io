// import /en_US/data/json/clothes.json


angular.module('splatApp').brands = function($scope) {
    $scope.brands = brands()
}

function brands() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/brands.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}