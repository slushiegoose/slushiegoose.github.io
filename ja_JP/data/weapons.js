// import /ja_JP/json/weapons.json


angular.module('splatApp').weapons = function($scope) {
    $scope.weaponSets = weapons()
}


async function weapons() {
    const response = await fetch('/ja_JP/json/weapons.json')
    const data = await response.json()
    return data
}