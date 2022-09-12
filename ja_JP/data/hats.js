// import /ja_JP/json/hats.json


angular.module('splatApp').hats = function($scope) {
    $scope.hats = hats()
}


async function weapons() {
    const response = await fetch('/ja_JP/json/hats.json')
    const data = await response.json()
    return data
}