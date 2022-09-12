// import /en_US/data/json/weapons.json


angular.module('splatApp').weapons = function($scope) {
    $scope.weaponSets = weapons()
}


async function weapons() {
    const response = await fetch('/en_US/data/json/weapons.json')
    const data = await response.json()
    return data
}