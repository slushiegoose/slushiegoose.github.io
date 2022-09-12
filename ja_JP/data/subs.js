// import /ja_JP/json/subs.json


angular.module('splatApp').subs = function($scope) {
    subs().then(data => {
        $scope.subs = data
    })
}



async function subs() {
    const response = await fetch('/ja_JP/json/subs.json')
    const data = await response.json()
    return data
}