// import /ja_JP/json/shoes.json


angular.module('splatApp').shoes = function($scope) {
    $scope.shoes = shoes()
}


function shoes() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/ja_JP/data/json/shoes.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}