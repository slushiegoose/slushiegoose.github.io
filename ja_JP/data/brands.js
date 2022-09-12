// import /en_US/data/json/clothes.json

var BRANDS = undefined

angular.module('splatApp').brands = function($scope) {
    $scope.brands = BRANDS || brands()
}

function brands() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/brands.json", false)
    xhttp.send(null)
    BRANDS = JSON.parse(xhttp.responseText)
    return BRANDS
}