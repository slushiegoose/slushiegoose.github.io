// import /en_US/data/json/subs.json


angular.module('splatApp').subs = function($scope) {
    $scope.subs = subs()
    $scope.getSubByName = function(name) {
        return $scope.subs.filter(function(sub) {
            return sub.name == name;
        })[0]
    }

    $scope.getDamagingSubs = function() {
        return $scope.subs.filter(function(sub) {
            return sub.hasOwnProperty("damage")
        })
    }
}


function subs() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/subs.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}