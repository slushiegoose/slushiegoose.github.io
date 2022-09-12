// import /en_US/data/json/skills.json


angular.module('splatApp').skills = function($scope) {
    $scope.skills = skills()
}


function skills() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/skills.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}