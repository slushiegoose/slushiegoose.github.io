// import /ja_JP/json/specials.json


angular.module('splatApp').specials = function($scope) {
    $scope.specials = specials()
}


async function weapons() {
    const response = await fetch('/ja_JP/json/specials.json')
    const data = await response.json()
    return data
}