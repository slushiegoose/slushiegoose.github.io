// import /en_US/data/json/clothes.json

var SPLASHTAGS = undefined;

angular.module('splatApp').splashtags = function($scope) {
    $scope.splashtags = SPLASHTAGS || splashtags()
}

function splashtags() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/splashtags.json", false)
    xhttp.send(null)
    SPLASHTAGS = JSON.parse(xhttp.responseText)
    return SPLASHTAGS
}