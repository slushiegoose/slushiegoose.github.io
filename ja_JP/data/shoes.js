// import /ja_JP/json/shoes.json


angular.module('splatApp').shoes = function($scope) {
    $scope.shoes = shoes()
}


async function weapons() {
    const response = await fetch('/ja_JP/json/shoes.json')
    const data = await response.json()
    return data
}