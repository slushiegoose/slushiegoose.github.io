// import /ja_JP/json/subs.json


angular.module('splatApp').subs = function($scope) {
    $scope.subs = subs()
}


async function weapons() {
    const response = await fetch('/ja_JP/json/subs.json')
    const data = await response.json()
    return data
}