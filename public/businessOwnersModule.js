'use strict';
let businessOwners = angular.module('businessOwners',[
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

businessOwners.config([
        '$routeProvider',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/createAccount',{
                    name: 'businessOwners create',
                    templateUrl:'modules/businessOwners/views/createOwner.client.view.html',
                    label: 'businessOwners create',
                    controller: 'businessOwnersController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessOwnersController',
                                files:[
                                    // Controllers
                                    'modules/businessOwners/controllers/businessOwners.client.controller.js',
                                ]
                            });
                        }]
                    }

                })
                .when('/signIn',{
                    name: 'businessOwners signIn',
                    templateUrl:'modules/businessOwners/views/signIn.client.view.html',
                    label: 'businessOwners signIn',
                    controller: 'businessOwnersController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessOwnersController',
                                files:[
                                    // Controllers
                                    'modules/businessOwners/controllers/businessOwners.client.controller.js',
                                ]
                            });
                        }]
                    }

                })
        }
    ]
);

businessOwners.factory('businessOwnerCalls', function($http, $routeParams) {
    console.log("in businessOwnerCalls factory");
    let env = 'http://localhost:3000';
    let businessOwnersMasterService = {
        detailBusinessOwner: function(req){
            let promise = $http({
                method: 'GET',
                url: env + '/businessOwner/detail/' + req.id
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        getBusinessOwners: function(req){
            let promise = $http({
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
            let promise = $http({
                method: 'GET',
                url: env + '/business/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        newBusiness: function(req){
            let promise = $http({
                method: 'POST',
                url: env + '/business/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        searchBusinesses: function(req){
            let promise = $http({
                method: 'POST',
                url: env + '/business/search',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateBusiness: function(req){
            let promise = $http({
                method: 'POST',
                url: env + '/business/update',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        newBusinessOwner: function(req){
            let promise = $http({
                method: 'POST',
                url: env + '/businessOwner/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateBusinessOwner: function(req){
            let promise = $http({
                method: 'POST',
                url: env + '/businessOwner/update',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        deleteBusinessOwner: function(req){
            let promise = $http({
                method: 'DELETE',
                url: env + '/businessOwner/delete/' + req.id
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return businessOwnersMasterService;
});


// Get application settings from Mongo
businessOwners.factory('businessOwnersSettings', [
    '$http',
    'methodCop',
    function(
        $http,
        methodCop
    ) {
        return {
            get : function () {
                return $http({
                    method: 'GET',
                    url: '/applications/settings/businessOwners'
                })
                    .then(
                        function (resp) {
                            if (methodCop.check([resp.data])) {
                                let settings = {
                                    name : resp.data.app[0].name // get name of app
                                };
                                angular.forEach(resp.data.app[0].settings, function (setting) {
                                    settings[setting.name] = setting.value; // get the settings for the app
                                });
                                return settings;
                            }
                        },
                        function (err) {
                            console.error('There was an error when trying to get businessOwners settings: ' + err);
                            return err;
                        }
                    );
            }
        }
    }
]);
