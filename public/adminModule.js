'use strict';
var admins = angular.module('admins',[
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
    'ngToast'
]);

admins.config([
        '$routeProvider',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/admin/signIn',{
                    name: 'admin signIn',
                    templateUrl:'modules/admin/views/adminSignIn.client.view.html',
                    label: 'admin signIn',
                    controller: 'adminController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'adminController',
                                files:[
                                    // Controllers
                                    'modules/admin/controllers/admin.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .when('/admin/view/businesses',{
                    name: 'businesses view',
                    templateUrl:'modules/admin/views/viewBusinesses.client.view.html',
                    label: 'businesses view',
                    controller: 'adminController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'adminController',
                                files:[
                                    // Controllers
                                    'modules/admin/controllers/admin.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
        }
    ]
);

admins.factory('adminCalls', function($http, $routeParams) {
    console.log("in adminCalls factory");
    //var env = 'http://localhost:3000';
    var adminMasterService = {
        isAuth: function(req){
            var promise = $http({
                method: 'GET',
                url: '/authentication/authenticate',
                params: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        detailBusinessOwner: function(req){
            var promise = $http({
                method: 'GET',
                url: '/businessOwner/detail/' + req.id
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        getBusinessOwners: function(req){
            var promise = $http({
                method: 'GET',
                url: '/businessOwner/list',
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
                url: '/business/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        newBusiness: function(req){
            var promise = $http({
                method: 'POST',
                url: '/business/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        searchBusinesses: function(req){
            var promise = $http({
                method: 'POST',
                url: '/business/search',
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
                url: '/business/update',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        newBusinessOwner: function(req){
            var promise = $http({
                method: 'POST',
                url: '/businessOwner/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateBusinessOwner: function(req){
            var promise = $http({
                method: 'POST',
                url: '/businessOwner/update',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        deleteBusinessOwner: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/businessOwner/delete/' + req.id
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return adminMasterService;
});