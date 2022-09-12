// import /en_US/data/json/clothes.json

var CLOTHES = undefined;

angular.module('splatApp').clothes = function($scope) {
    $scope.clothes = CLOTHES || clothes()
}

function clothes() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/clothes.json", false)
    xhttp.send(null)
    CLOTHES = JSON.parse(xhttp.responseText)
    return CLOTHES
}