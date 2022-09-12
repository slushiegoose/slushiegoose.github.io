// import /ja_JP/json/subs.json


angular.module('splatApp').subs = function($scope) {
    $scope.subs = subs()
}


function subs() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/ja_JP/data/json/subs.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}