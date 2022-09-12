// import /en_US/data/json/skills.json


angular.module('splatApp').skills = function($scope) {
    skills().then(data => {
        $scope.skills = data
    })
}



async function skills() {
    const response = await fetch('/en_US/data/json/skills.json')
    const data = await response.json()
    return data
}