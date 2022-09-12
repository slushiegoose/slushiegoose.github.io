// import /en_US/data/json/clothes.json

var BADGES = undefined;

angular.module('splatApp').badges = function($scope) {
    $scope.badges = BADGES || badges()
}

function badges() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/badges.json", false)
    xhttp.send(null)
    BADGES = JSON.parse(xhttp.responseText)
    return BADGES
}