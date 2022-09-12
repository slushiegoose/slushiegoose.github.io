// import /en_US/data/json/shoes.json


angular.module('splatApp').shoes = function($scope) {
    $scope.shoes = shoes()
}


async function weapons() {
    const response = await fetch('/en_US/data/json/shoes.json')
    const data = await response.json()
    return data
}