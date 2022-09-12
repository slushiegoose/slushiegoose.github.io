// import /ja_JP/json/specials.json


angular.module('splatApp').specials = function($scope) {
    specials().then(data => {
        $scope.specials = data
    })
}




async function specials() {
    const response = await fetch('/ja_JP/json/specials.json')
    const data = await response.json()
    return data
}