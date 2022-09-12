// import /ja_JP/json/clothes.json


angular.module('splatApp').clothes = function($scope) {
    $scope.clothes = clothes()
}


async function weapons() {
    const response = await fetch('/ja_JP/json/clothes.json')
    const data = await response.json()
    return data
}