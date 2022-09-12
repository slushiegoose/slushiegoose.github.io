// import /en_US/data/json/weapons.json


var WEAPONS = undefined;

angular.module('splatApp').weapons = function($scope) {
    $scope.weaponSets = WEAPONS || weapons()

    $scope.getWeaponSetById = function(setid) {
        return $scope.weaponSets.filter(function(set) {
            return set.id == setid
        })[0]
    }

    $scope.getWeaponById = function(setid, weaponid) {
        return $scope.getWeaponSetById(setid).weapons.filter(function(weapon) {
            return weapon.id == weaponid
        })[0]
    }
}


function weapons() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/en_US/data/json/weapons.json", false)
    xhttp.send(null)
    WEAPONS = JSON.parse(xhttp.responseText)
    return WEAPONS
}