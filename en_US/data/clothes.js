// import /en_US/data/json/clothes.json


angular.module('splatApp').clothes = function($scope) {
    $scope.clothes = clothes()
}


async function weapons() {
    const response = await fetch('/en_US/data/json/clothes.json')
    const data = await response.json()
    return data
}