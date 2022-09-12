// import /ja_JP/json/weapons.json


angular.module('splatApp').weapons = function($scope) {
    weapons().then(data => {
        $scope.weaponSets = data
    })
}



async function weapons() {
    const response = await fetch('/ja_JP/json/weapons.json')
    const data = await response.json()
    return data
}