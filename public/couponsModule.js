var coupons = angular.module('coupons',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad'
]);

coupons.config([
        '$routeProvider',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/coupon/create',{
                    name: 'coupons',
                    templateUrl:'modules/coupons/views/createCoupon.client.view.html',
                    label: 'coupons',
                    controller: 'couponsController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'couponsController',
                                files:[
                                    // Controllers
                                    'modules/coupons/controllers/coupons.client.controller.js',
                                ]});
                        }]
                    }

                })
                .when('/coupon/update',{
                    name: 'coupons',
                    templateUrl:'modules/coupons/views/updateCoupon.client.view.html',
                    label: 'update coupons',
                    controller: 'couponsController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'couponsController',
                                files:[
                                    'modules/coupons/controllers/coupons.client.controller.js',
                                ]});
                        }]
                    }
                })
                .when('/coupons/view',{
                    name: 'coupons',
                    templateUrl:'modules/coupons/views/viewCoupons.client.view.html',
                    label: 'view coupons',
                    controller: 'couponsController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'couponsController',
                                files:[
                                    // Controllers
                                    'modules/coupons/controllers/coupons.client.controller.js',
                                ]});
                        }]
                    }})
        }
    ]
);

coupons.factory('couponCalls', function($http, $routeParams) {
    console.log("in couponCalls factory");
    var env = 'http://localhost:3000';
    var couponsMasterService = {
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
        newBusiness: function(req){
            var promise = $http({
                method: 'POST',
                url: env + '/business/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        newCoupon: function(req){
            var promise = $http({
                method: 'POST',
                url: env + '/coupon/create',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        searchCoupons: function(req){
            var promise = $http({
                method: 'POST',
                url: env + '/coupon/search',
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
                url: env + '/business/update',
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
                url: env + '/businessOwner/create',
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
                url: env + '/businessOwner/update',
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
                url: env + '/businessOwner/delete/' + req.id
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return couponsMasterService;
});


// Get application settings from Mongo
coupons.factory('couponsSettings', [
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
                    url: '/applications/settings/coupons'
                })
                    .then(
                        function (resp) {
                            if (methodCop.check([resp.data])) {
                                var settings = {
                                    name : resp.data.app[0].name // get name of app
                                };
                                angular.forEach(resp.data.app[0].settings, function (setting) {
                                    settings[setting.name] = setting.value; // get the settings for the app
                                });
                                return settings;
                            }
                        },
                        function (err) {
                            console.error('There was an error when trying to get coupons settings: ' + err);
                            return err;
                        }
                    );
            }
        }
    }
]);
