// import /ja_JP/json/skills.json


angular.module('splatApp').skills = function($scope) {
    $scope.skills = skills()
}


async function weapons() {
    const response = await fetch('/ja_JP/json/skills.json')
    const data = await response.json()
    return data
}