// import /en_US/data/json/skills.json


angular.module('splatApp').skills = function($scope) {
    $scope.skills = skills()
    $scope.getSkillByName = function(name) {
        return $scope.skills.filter(function(skill) {
            return skill.name == name;
        })[0]
    }

    $scope.getSkillById = function(skillid) {
        var results = $scope.skills.filter(function(skill) {
            return skill.id == skillid
        })[0]
        if (results == undefined) {
            return null;
        } else return results;
    }

    $scope.getExclusiveSkills = function(slot) {
        return $scope.skills.filter(function(skill) {
            if (skill.exclusive && skill.exclusive != 'hidden') return true;
        })
    }

    $scope.getStackableSkills = function() {
        return $scope.skills.filter(function(skill) {
            if (!skill.exclusive) return true;
        })
    }
}


function skills() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/skills.json", false)
    xhttp.send(null)
    return JSON.parse(xhttp.responseText)
}