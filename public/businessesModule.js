var businesses = angular.module('businesses',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad'
]);

businesses.config([
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
                .when('/business/claim/:testId',{
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
                                ]});
                        }]
                    }

                })

        }
    ]
);

businesses.factory('businessesCalls', function($http, $routeParams) {
    console.log("in businessesCalls factory");
    //var env = 'http://localhost:3000';
    var businessesMasterService = {
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
        getSignedInBusinessOwner: function(req){
            var promise = $http({
                method: 'GET',
                url: '/businessOwner/me',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return businessesMasterService;
});
