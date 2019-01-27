'use strict';

//This block of code checks for the browser version, and if not IE9, injects Angular Material
var ua = window.navigator.userAgent;
var msie = ua.indexOf ( "MSIE " );
var IEVersion = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
if (IEVersion <= 9){
//var d = document.getElementById("upgradewarn");
//d.className = d.className + "show";
}

var users = angular.module('users',['ngAnimate','ngMaterial']);

users.controller('AuthenticationController',['$scope','$http','$log','$location','$rootScope',
    function($scope,$http,$log,$location,$rootScope) {

//This block of code checks for the browser version, and if not IE9, injects Angular Material
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf ( "MSIE " );
        var IEVersion = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
        if (IEVersion <= 9){
            $scope.reqUpgrade = true;
        }
        $scope.env = 'http://localhost:3000';

        // show toast indicating success
        $rootScope.createToast = function(myClass) {
            console.log("in create toast function");
            $scope.toast = ngToast.create({
                className: myClass,
                compileContent: true,
                content: $sce.trustAsHtml('<i class="fa fa-thumbs-o-down"></i><br>' + 'email or password is not correct.'),
                dismissButton: true,
                dismissButtonHtml: '<md-button class="md-raised">OK</md-button>',
                dismissOnClick: true,
                dismissOnTimeout: true,
                timeout: 3 * 1000
            });
        };

        $scope.openPage = function (pageName) {
            $location.path(pageName.replace(/#/, ''));
        };

        ///// AUTHENICATION FUNCTIONS ///////////////
        $scope.signIn = function(credentials) {

           /* $http.post('/auth/signin', $scope.credentials).success(function(response) {
// If successful we assign the response to the global user model
                $rootScope.user = response;

                /*Allows Redirect to specific url if false
                if(window.location.href > -1) {
                    window.location.href ='/';
                } else {
                    window.location.href = window.location.href;
//reload here to bring up deep link screen after sign in
                    location.reload();
                }
            }).error(function(response) {
                $scope.error = response.message;
            });*/

            delete $scope.error;
            console.log('in signIn');
            $http.post($scope.env + '/user/signIn', $scope.credentials)
                .success(function(response) {

                   if(window.location.href > -1) {
                        window.location.href ='/';
                    } else {
                        window.location.href = window.location.href;
//reload here to bring up deep link screen after sign in
                        location.reload();
                    }

                    // CHECK ROLES //
                    /*response.roles.forEach(function(role) {
                        if (role === "admin") {
                            $scope.openPage('/admin/home')
                        } else if (role === "business owner") {
                            $scope.openPage('/businessOwner/home')
                        }
                    })*/
                })
                .error(function(response) {
                    console.dir("error: " + response);
                    $scope.error = response.message;
                });
        };

        $scope.signInClaim = function(credentials) {
            var id = $routeParams.id;
            async.series([
                function(callback) {

                    businessOwnerCalls.searchBusinesses({
                        id: id
                    }).then(
                        function (res) {
                            $scope.business = res.data;
                            callback();
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err.data.message));
                        }
                    )
                },

                function (callback) {

                    delete $scope.error;
                    $http.post($scope.env + '/businessOwner/signIn', credentials)
                        .success(function(response) {

                            if (id) {
                                callback();
                            } else if (response.businesses.length > 0) {
                                if (response.businesses.length > 1) {
                                    console.log('list businesses here');
                                } else {
                                    console.log('single business view');
                                }
                            } else {
                                console.log('load claim');
                                $scope.claimBusiness($scope.business);
                            }
                        })
                        .error(function(response) {
                            console.dir(response);
                            $scope.createToast('Danger');
                        });

                },
                function() {
                    $scope.claimBusiness($scope.business);
                }
            ]);


        };

    }
]);

/*users.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide',
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
    });
}]);*/