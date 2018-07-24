'use strict';
var businessListings = angular.module('businessListings', [
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.exporter',
    'ui.grid.resizeColumns',
    'ui.grid.cellNav',
    'ui.grid.autoResize',
    'ngAnimate',
    'ngLodash',
    'ngMaterial',
    'ngMaterialDatePicker',
    'ui.bootstrap',
    'gm.typeaheadDropdown',
    'angular-clipboard',
    'ngRoute',
    'oc.lazyLoad',
    'ngToast',
    ]);

businessListings.config([
        '$routeProvider',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/listings',{
                    name: 'businessListings view',
                    templateUrl:'modules/businessOwners/views/businessListings.client.view.html',
                    label: 'businessListings view',
                    controller: 'businessListingsController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessListingsController',
                                files:[
                                    // Controllers
                                    'modules/businessOwners/controllers/businessListings.client.controller.js',
                                ]
                            });
                        }]
                    }

                })
        }
    ]
);


businessListings.factory('businessListingsCalls', function($http) {
    console.log("in businessListingsCalls factory");
    var env = 'http://localhost:3000';
    var businessOwnersMasterService = {
        isAuth: function(req){
            var promise = $http({
                method: 'GET',
                url: env + '/authentication/authenticate',
                params: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        claimBusiness: function(req){
            var promise = $http({
                method: 'POST',
                url: '/:businessId',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateBusiness: function(req){
            var promise = $http({
                method: 'POST',
                url: '/:businessId',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        detailBusinessOwner: function(req){
            var promise = $http({
                method: 'GET',
                url: env + '/businessOwner/detail/' + req.id
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        getBusinessOwners: function(req){
            var promise = $http({
                method: 'GET',
                url: env + '/businessOwner/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getBusinesses: function(req){
            var promise = $http({
                method: 'GET',
                url: env + '/business/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        searchBusinesses: function(req){
            var promise = $http({
                method: 'POST',
                url: env + '/business/search',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return businessOwnersMasterService;
});