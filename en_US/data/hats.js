// import /en_US/data/json/hats.json


angular.module('splatApp').hats = function($scope) {
    hats().then(data => {
        $scope.hats = data
    })
}



async function hats() {
    const response = await fetch('/en_US/data/json/hats.json')
    const data = await response.json()
    return data
}