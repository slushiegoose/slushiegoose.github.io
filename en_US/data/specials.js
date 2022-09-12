// import /en_US/data/json/specials.json


angular.module('splatApp').specials = function($scope) {
    specials().then(data => {
        $scope.specials = data
    })
}




async function specials() {
    const response = await fetch('/en_US/data/json/specials.json')
    const data = await response.json()
    return data
}