let businesses = angular.module('businesses',[
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
                                    'modules/businesses/controllers/businesses.client.controller.js',
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
                                    'modules/businesses/controllers/businesses.client.controller.js',
                                ]});
                        }]
                    }

                })

        }
    ]
);

businesses.factory('businessesCalls', function($http, $routeParams) {
    console.log("in businessesCalls factory");
    let env = 'http://localhost:3000';
    let businessesMasterService = {
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
    return businessesMasterService;
});
