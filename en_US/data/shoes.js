// import /en_US/data/json/shoes.json


angular.module('splatApp').shoes = function($scope) {
    shoes().then(data => {
        $scope.shoes = data
    })
}



async function shoes() {
    const response = await fetch('/en_US/data/json/shoes.json')
    const data = await response.json()
    return data
}