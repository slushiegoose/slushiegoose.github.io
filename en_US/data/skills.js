// import /en_US/data/json/skills.json


angular.module('splatApp').skills = function($scope) {
    $scope.skills = skills()
}


async function weapons() {
    const response = await fetch('/en_US/data/json/skills.json')
    const data = await response.json()
    return data
}