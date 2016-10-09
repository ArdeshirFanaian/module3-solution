(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItem.html',
    scope: {
      items: '<',
      onRemove: '&',
      errorMessage: '<'
    },
    controller: NarrowItDownController,
    controllerAs: 'list',
    bindToController: true,
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;


  ctrl.searchTerm = '';
  ctrl.found = [];
  ctrl.errorMessage = false;

  ctrl.logMenuItems = function () {
    var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
    promise.then(function (response) {
      if (response.length !== 0) {
        ctrl.errorMessage = false;
      ctrl.found = response;
    } else {
      ctrl.errorMessage = true;
    }
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
      ctrl.errorMessage = true;
    })
  };

  ctrl.removeItem = function (itemIndex) {
    ctrl.found.splice(itemIndex, 1);
  };
};


MenuSearchService.$inject = ['$http', 'ApiBasePath', '$filter']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (result) {

      var foundItems1 = result.data.menu_items;
      var foundItems = [];
        for (var i=0; i < foundItems1.length; i++) {
          if (foundItems1[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(foundItems1[i]);
          }
        }
      return foundItems;

    });

  };

  service.message = function () {
    if (foundItems === []) {
      return true;
    } else {
      return false;
    }
  }
}

})();
