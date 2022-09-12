// import /en_US/data/json/clothes.json


angular.module('splatApp').clothes = function($scope) {
    clothes().then(data => {
        $scope.clothes = data
    })
}


async function clothes() {
    const response = await fetch('/en_US/data/json/clothes.json')
    const data = await response.json()
    return data
}