// import /en_US/data/json/specials.json

var SPECIALS = undefined;

angular.module('splatApp').specials = function($scope) {
    $scope.specials = SPECIALS || specials()
    $scope.getSpecialByName = function(name) {
        return $scope.specials.filter(function(special) {
            return special.name == name;
        })[0]
    }

    $scope.getDamagingSpecials = function() {
        return $scope.specials.filter(function(special) {
            return special.hasOwnProperty("damage")
        })
    }
}



function specials() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/specials.json", false)
    xhttp.send(null)
    SPECIALS = JSON.parse(xhttp.responseText)
    return SPECIALS
}