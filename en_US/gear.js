angular.module('splatApp').gear = function($scope) {
    angular.module('splatApp').hats($scope);
    angular.module('splatApp').clothes($scope);
    angular.module('splatApp').shoes($scope);
    angular.module('splatApp').brands($scope);
    angular.module('splatApp').badges($scope);


    $scope.filterByMain = function(set, abilityName) {
        if (abilityName == null) return { primary: set, secondary: [] }

        var primary = set.filter(function(item) {
            return item.main == abilityName;
        })
        var secondary = set.filter(function(item) {
            return (item.brand != "amiibo" && item.brand != "Cuttlegear" && item.brand != "Grizzco" && item.main != abilityName) || (item.brand == "Grizzco" && item.main != abilityName && !$scope.getSkillByName(abilityName).exclusive);
        })

        var notEligible = set.filter(function(item) {
            return !$scope.isPossibleMain(item, abilityName)
        })
        return { primary, secondary, notEligible };
    }

    $scope.isPossibleMain = function(item, abilityName) {
        return true;
    }

    $scope.getHatById = function(id) {
        return $scope.hats.filter(function(item) {
            return item.id == id
        })[0]
    }
    $scope.getClothesById = function(id) {
        return $scope.clothes.filter(function(item) {
            return item.id == id
        })[0]
    }
    $scope.getShoesById = function(id) {
        return $scope.shoes.filter(function(item) {
            return item.id == id
        })[0]
    }

    $scope.getSplashtagById = function(id) {
        return $scope.splashtags.filter(function(item) {
            return item.id == id
        })[0]
    }

    $scope.getSubjectById = function(id) {
        return $scope.subjects.filter(function(item) {
            return item.id == id
        })[0]
    }

    $scope.getAdjectiveById = function(id) {
        return $scope.adjectives.filter(function(item) {
            return item.id == id
        })[0]
    }

    $scope.getBadgeById = function(badgeId) {
        var results = $scope.badges.filter(function(badge) {
            return badge.id == badgeId
        })[0]
        if (results == undefined) {
            return null;
        } else return results;
    }
}