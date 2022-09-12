// import /ja_JP/json/clothes.json


angular.module('splatApp').clothes = function($scope) {
    clothes().then(data => {
        $scope.clothes = data
    })
}


async function clothes() {
    const response = await fetch('/ja_JP/json/clothes.json')
    const data = await response.json()
    return data
}