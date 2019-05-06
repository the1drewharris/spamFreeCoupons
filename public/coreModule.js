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
                .when('/businessOwner/editBusiness/:id',{
                    name: 'businessOwner editBusiness',
                    templateUrl:'modules/core/views/editBusiness.client.view.html',
                    label: 'businessOwner editBusiness',
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
                .when('/businessOwner/claimBusinesses',{
                    name: 'businessOwner claimBusinesses',
                    templateUrl:'modules/core/views/viewBusinesses.client.view.html',
                    label: 'businessOwner claimBusinesses',
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
                .when('/businessOwner/claim/:id',{
                    name: 'businessOwner claimBusiness',
                    templateUrl:'modules/core/views/claimBusiness.client.view.html',
                    label: 'businessOwner claimBusiness',
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
                    templateUrl: 'modules/core/views/adminHome.client.view.html',
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
                .when('/admin/viewBusinesses',{
                    name: 'admin viewBusinesses',
                    templateUrl:'modules/core/views/viewBusinesses.client.view.html',
                    label: 'admin viewBusinesses',
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
                .when('/admin/viewCoupons',{
                    name: 'admin viewCoupons',
                    templateUrl:'modules/core/views/viewCoupons.client.view.html',
                    label: 'admin viewCoupons',
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
                .when('/admin/business/viewCoupons/:id',{
                    name: 'admin viewCoupons',
                    templateUrl:'modules/core/views/viewBusinessCoupon.client.view.html',
                    label: 'admin viewCoupons',
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
                .when('/admin/addCoupon/:id',{
                    name: 'admin addCoupon',
                    templateUrl:'modules/core/views/createCoupon.client.view.html',
                    label: 'admin addCoupon',
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
                .when('/admin/editBusiness/:id',{
                    name: 'admin editBusiness',
                    templateUrl:'modules/core/views/editBusiness.client.view.html',
                    label: 'admin editBusiness',
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
                .when('/admin/editCoupon/:id',{
                    name: 'admin editCoupon',
                    templateUrl:'modules/core/views/editCoupon.client.view.html',
                    label: 'admin editCoupon',
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
                .when('/notAuthorized',{
                    name: 'notAuthorized',
                    templateUrl:'modules/core/views/notAuth.client.view.html',
                    label: 'notAuthorized',
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
                .when('/admin/createBusiness',{
                    name: 'createBusiness',
                    templateUrl:'modules/core/views/createBusiness.client.view.html',
                    label: 'createBusiness',
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
        getSignedInUser: function(req){
            var promise = $http({
                method: 'GET',
                url: '/user/me',
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
        },
        deleteBCoupons: function(req){
        var promise = $http({
            method: 'DELETE',
            url: '/coupon/bDelete/' + req.businessId
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
        },
        getBusiness: function(req){
            var promise = $http({
                method: 'POST',
                url: '/business/search',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return businessesMasterService;
});