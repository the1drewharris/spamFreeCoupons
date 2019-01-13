'use strict';
var cores = angular.module('cores',[
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

cores.config([
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
                                    'modules/businessOwners/controllers/businessOwners.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .when('/createAccount/business/:id',{
                    name: 'businessOwners create',
                    templateUrl:'modules/businessOwners/views/createOwnerClaim.client.view.html',
                    label: 'businessOwners create',
                    controller: 'businessOwnersController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessOwnersController',
                                files:[
                                    // Controllers
                                    'modules/businessOwners/controllers/businessOwners.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .when('/',{
                    name: 'user signIn',
                    templateUrl:'modules/core/views/signIn.client.view.html',
                    label: 'user signIn',
                    controller: 'coreController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'coreController',
                                files:[
                                    // Controllers
                                    'modules/core/controllers/core.client.controller.js'
                                ]
                            });
                        }]
                    }

                })
                .when('/signIn',{
                    name: 'user signIn',
                    templateUrl:'modules/core/views/signIn.client.view.html',
                    label: 'user signIn',
                    controller: 'coreController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'coreController',
                                files:[
                                    // Controllers
                                    'modules/core/controllers/core.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .when('/signIn/business/:id',{
                    name: 'businessOwners signInClaim',
                    templateUrl:'modules/businessOwners/views/signInClaim.client.view.html',
                    label: 'businessOwners signInClaim',
                    controller: 'businessOwnersController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessOwnersController',
                                files:[
                                    // Controllers
                                    'modules/businessOwners/controllers/businessOwners.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .when('/businessOwner/home',{
                    name: 'businessOwner home',
                    templateUrl:'modules/core/views/businessOwnerHome.client.view.html',
                    label: 'businessOwner home',
                    controller: 'coreController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'coreController',
                                files:[
                                    // Controllers
                                    'modules/core/controllers/core.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .when('/admin/home',{
                    name: 'admin home',
                    templateUrl:'modules/core/views/adminHome.client.view.html',
                    label: 'admin home',
                    controller: 'coreController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'coreController',
                                files:[
                                    // Controllers
                                    'modules/core/controllers/core.client.controller.js'
                                ]
                            });
                        }]
                    }
                })
        }
    ]
);

/*businesses.config([
        '$routeProvider',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/business/create',{
                    name: 'businesses',
                    templateUrl:'modules/businesses/views/createBusiness.client.view.html',
                    label: 'businesses',
                    controller: 'businessesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessesController',
                                files:[
                                    // Controllers
                                    'modules/businesses/controllers/businesses.client.controller.js'
                                ]});
                        }]
                    }
                })
                .when('/view/businesses',{
                    name: 'businesses',
                    templateUrl:'modules/businesses/views/viewBusinesses.client.view.html',
                    label: 'businesses',
                    controller: 'businessesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessesController',
                                files:[
                                    // Controllers
                                    'modules/businesses/controllers/businesses.client.controller.js'
                                ]});
                        }]
                    }

                })
                .when('/business/claim/:id',{
                    name: 'business claim',
                    templateUrl:'modules/businesses/views/claimBusiness.client.view.html',
                    label: 'business claim',
                    controller: 'businessesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessesController',
                                files:[
                                    // Controllers
                                    'modules/businesses/controllers/businesses.client.controller.js'
                                ]});
                        }]
                    }

                })

                .when('/business/view/:id',{
                    name: 'business edit',
                    templateUrl:'modules/businesses/views/updateBusiness.client.view.html',
                    label: 'business edit',
                    controller: 'businessesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'businessesController',
                                files:[
                                    // Controllers
                                    'modules/businesses/controllers/businesses.client.controller.js'
                                ]
                            });
                        }]
                    }

                })


        }
    ]
);*/

cores.factory('userCalls', function($http, $routeParams) {
    console.log("in userCalls factory");
    //var env = 'http://localhost:3000';
    var userMasterService = {
        getUsers: function(req){
            var promise = $http({
                method: 'GET',
                url: '/user/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        detailUser: function(req){
            var promise = $http({
                method: 'GET',
                url: '/user/detail/' + req.id
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        newUser: function(req){
            var promise = $http({
                method: 'POST',
                url: '/user/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateUser: function(req){
            var promise = $http({
                method: 'POST',
                url: '/user/update',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        deleteUser: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/user/delete/' + req.id
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return userMasterService;
});

cores.factory('couponCalls', function($http, $routeParams) {
    console.log("in couponCalls factory");
    //var env = 'http://localhost:3000';
    var couponsMasterService = {
        newCoupon: function(req){
            var promise = $http({
                method: 'POST',
                url: '/coupon/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getCoupons: function(req){
            var promise = $http({
                method: 'GET',
                url: '/coupon/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        detailCoupon: function(req){
            var promise = $http({
                method: 'GET',
                url: '/coupon/detail/' + req.id
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        searchCoupons: function(req){
            var promise = $http({
                method: 'POST',
                url: '/coupon/search',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateCoupon: function(req){
            var promise = $http({
                method: 'POST',
                url: '/coupon/update',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        deleteCoupon: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/coupon/delete/' + req.id
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return couponsMasterService;
});

cores.factory('businessesCalls', function($http, $routeParams) {
    console.log("in businessesCalls factory");
    var businessesMasterService = {
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
        detailBusiness: function(req){
            var promise = $http({
                method: 'GET',
                url: '/business/detail/' + req.id
            }).then(function (response) {
                return response;
            });
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
        sendCode: function(req){
            var promise = $http({
                method: 'GET',
                url: '/business/sendCode/' + req.id
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        setCode: function(req){
            var promise = $http({
                method: 'POST',
                url: '/business/setCode',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        deleteBusiness: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/business/delete/' + req.id
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return businessesMasterService;
});