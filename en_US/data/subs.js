// import /en_US/data/json/subs.json


angular.module('splatApp').subs = function($scope) {
    $scope.subs = subs()
}


async function weapons() {
    const response = await fetch('/en_US/data/json/subs.json')
    const data = await response.json()
    return data
}