'use strict';

//This block of code checks for the browser version, and if not IE9, injects Angular Material
var ua = window.navigator.userAgent;
var msie = ua.indexOf ( "MSIE " );
var IEVersion = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
if (IEVersion <= 9){
//var d = document.getElementById("upgradewarn");
//d.className = d.className + "show";
}

var users = angular.module('users',['ngAnimate','ngMaterial','vcRecaptcha']);

users.controller('AuthenticationController',['$scope','$http','$log','$location','$rootScope','vcRecaptchaService',
    function($scope,$http,$log,$location,$rootScope, vcRecaptchaService) {

//This block of code checks for the browser version, and if not IE9, injects Angular Material
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf ( "MSIE " );
        var IEVersion = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
        if (IEVersion <= 9){
            $scope.reqUpgrade = true;
        }
        $scope.passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        $scope.credentials = {
            name:'',
            email:'',
            password:'',
            confirmPassword:''
        };
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

        $scope.createAccount = function() {

            delete $scope.error;

            console.dir($scope.credentials);

            $scope.credentials.email = $scope.credentials.email.toLowerCase();

            $http.post($scope.env + '/user/createBusinessOwner', $scope.credentials)
                .success(function () {
                    $scope.signIn(false);
                })
                .error(function (response) {
                    console.dir("error: " + response.message);
                    $scope.error = response.message;
                });

        };

        $scope.signIn = function(reload) {
            delete $scope.error;
            console.log('in signIn');
            $scope.credentials.email = $scope.credentials.email.toLowerCase();
            $http.post($scope.env + '/user/signIn', $scope.credentials)
                .success(function(response) {

                    console.log(window.location.href);

                    /*
                    if(window.location.href > -1) {
                        window.location.href ='/';
                        location.reload();
                    } else {
                        window.location.href = window.location.href;
                        //reload here to bring up deep link screen after sign in
                        location.reload();
                    }*/

                    // CHECK ROLES //
                    response.roles.forEach(function(role) {
                        if (role === "admin") {
                            window.location.href = $scope.env + '/#/admin/home';
                            if (reload) {
                                location.reload();
                            }
                        } else if (role === "businessOwner") {
                            window.location.href = $scope.env + '/#/businessOwner/home';
                            if (reload) {
                                location.reload();
                            }
                        }
                    })
                })
                .error(function(response) {
                    console.dir("error: " + response);
                    $scope.error = response.message;
                });
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