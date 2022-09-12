// import /en_US/data/json/specials.json


angular.module('splatApp').specials = function($scope) {
    $scope.specials = specials()
}


async function weapons() {
    const response = await fetch('/en_US/data/json/specials.json')
    const data = await response.json()
    return data
}