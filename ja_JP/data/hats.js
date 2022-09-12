// import /ja_JP/json/hats.json


angular.module('splatApp').hats = function($scope) {
    hats().then(data => {
        $scope.hats = data
    })
}



async function hats() {
    const response = await fetch('/ja_JP/json/hats.json')
    const data = await response.json()
    return data
}