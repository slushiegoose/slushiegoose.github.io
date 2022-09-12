// import /en_US/data/json/hats.json


angular.module('splatApp').hats = function($scope) {
    $scope.hats = hats()
}


async function weapons() {
    const response = await fetch('/en_US/data/json/hats.json')
    const data = await response.json()
    return data
}