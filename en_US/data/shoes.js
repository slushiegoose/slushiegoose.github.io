// import /en_US/data/json/shoes.json


var SHOES = undefined;

angular.module('splatApp').shoes = function($scope) {
    $scope.shoes = SHOES || shoes()
}


function shoes() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/shoes.json", false)
    xhttp.send(null)
    SHOES = JSON.parse(xhttp.responseText)
    return SHOES
}