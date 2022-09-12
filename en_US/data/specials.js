// import /en_US/data/json/specials.json


angular.module('splatApp').specials = function($scope) {
    $scope.specials = specials()
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
    return JSON.parse(xhttp.responseText)
}