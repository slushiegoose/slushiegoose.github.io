// import /en_US/data/json/clothes.json


angular.module('splatApp').clothes = function($scope) {
    $scope.clothes = clothes()
}

function clothes() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/clothes.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}