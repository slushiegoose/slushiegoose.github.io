angular.module('splatApp').gear = function($scope) {
  angular.module('splatApp').hats($scope);
  angular.module('splatApp').clothes($scope);
  angular.module('splatApp').shoes($scope);
  angular.module('splatApp').brands($scope);


  $scope.filterByMain = function(set, abilityName) {
    if(abilityName == null) return {primary: set, secondary: []}

    var primary = set.filter(function(item) {
      return item.main == abilityName;
    })
    var secondary = set.filter(function(item) {
      return (item.brand != "amiibo" && item.brand != "Cuttlegear" && item.brand !="Grizzco" && item.main != abilityName) || (item.brand == "Grizzco" && item.main != abilityName && !$scope.getSkillByName(abilityName).exclusive);
    })

    var notEligible = set.filter(function(item) {
      return !$scope.isPossibleMain(item,abilityName)
    })
    return {primary, secondary, notEligible};
  }

  $scope.isPossibleMain = function(item, abilityName) {
    return abilityName == undefined || item.main == abilityName || (item.brand != "amiibo" && item.brand != "Cuttlegear" && item.brand !="Grizzco" && item.main != abilityName) || (item.brand == "Grizzco" && item.main != abilityName && !$scope.getSkillByName(abilityName).exclusive) || (item.splatnetShop != null && item.splatnetShop);
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
}
