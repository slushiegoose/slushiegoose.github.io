// import /en_US/data/json/clothes.json

var ADJECTIVES = undefined;

angular.module('splatApp').adjectives = function($scope) {
    $scope.adjectives = ADJECTIVES || adjectives()
}

function adjectives() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/adjectives.json", false)
    xhttp.send(null)
    ADJECTIVES = JSON.parse(xhttp.responseText)
    return ADJECTIVES
}