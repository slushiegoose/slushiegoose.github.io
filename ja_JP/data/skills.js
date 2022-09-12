// import /ja_JP/json/skills.json


angular.module('splatApp').skills = function($scope) {
    skills().then(data => {
        $scope.skills = data
    })
}



async function skills() {
    const response = await fetch('/ja_JP/json/skills.json')
    const data = await response.json()
    return data
}