// import /en_US/data/json/clothes.json

var SUBJECTS = undefined

angular.module('splatApp').subjects = function($scope) {
    $scope.subjects = SUBJECTS || subjects()
}

function subjects() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/subjects.json", false)
    xhttp.send(null)
    SUBJECTS = JSON.parse(xhttp.responseText)
    return SUBJECTS
}