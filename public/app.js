'use strict';
var app = angular.module('anonymousCoupons', [
    // Angular Plugins
    'ngRoute',
    'ngIdle',
    'oc.lazyLoad',
    'ui.bootstrap',
    'ngToast',
    'ngLodash',
    'ngAnimate',
    'ngMaterial',
    // 'ui.grid',
    'xeditable',

    // anonymousCoupons Application Modules
    'cores'

]);

app.controller('MainController', function (
    $scope,
    $ocLazyLoad,
    $rootScope,
    $http,
    $location,
    $modal,
    $log,
    $route,
    ngToast,
    authorization,
    $mdToast,
    $sce
) {

    $rootScope.FOO = "hello world I am";
    console.log($rootScope.FOO);
    $scope.env = 'http://localhost:3001';

    //This block of code checks for the browser version, and if not IE9, injects Angular Material
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf ( "MSIE " );
    var IEVersion = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
    if (IEVersion > 9){
        angular.module('anonymousCoupons').requires.push('ngMaterial');
    }

    $scope.openPage = function (pageName) {
        console.log('in openPage function');
        $location.path(pageName.replace(/#/, ''));
    };

    // show toast indicating success
    $rootScope.createToast = function(myClass) {  //FIXME: toast not working
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


});

app.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide', // or 'fade'
        verticalPosition: 'top',
        horizontalPosition: 'right'
    });
}]);

app.controller('headerController', function($scope, $window) {

    console.log('in headerController');

    $scope.logout = function () {
        $window.open('/user/signOut', "_self");
    };

});

app.controller('navController', function($scope, $location, userCalls) {

    $scope.openPage = function (pageName) {
        $location.path(pageName.replace(/#/, ''));
    };

    $scope.homeURL = function() {

        if ($scope.match === true) {
            $scope.openPage('admin/home')
        } else {
            $scope.openPage('businessOwner/home')
        }

    };

    $scope.businessURL = function() {

        if ($scope.match === true) {
            $scope.openPage('admin/viewBusinesses')
        } else {
            $scope.openPage('businessOwner/viewBusinesses')
        }

    };

    $scope.couponURL = function() {

        if ($scope.match === true) {
            $scope.openPage('admin/viewCoupons')
        } else {
            $scope.openPage('businessOwner/viewCoupons')
        }

    };

    $scope.checkRoles = function(Role, callback) {

        console.log('in checkRoles function');

        var checkRole = Role;
        console.log(checkRole);
        $scope.match = false;

        userCalls.getSignedInUser({}).then(
            function (res) {
                console.dir(res.data.user.roles);

                res.data.user.roles.forEach(function (role) {
                    console.log(checkRole);
                    console.log(role);
                    console.log(role === checkRole);
                    if(role === checkRole) {
                        $scope.match = true;
                        console.log($scope.match);
                    }
                });
                callback();


            },
            function (err) {
                console.error('Error getting businessOwners: ' + err.message);
            }
        );

        console.log("Match : " + $scope.match)

    };
});

/* ================================================================================
 Modal Controller for home/dashboard
 * ================================================================================ */
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        // $log.info('We are canceling...');
        $modalInstance.dismiss('cancel');
    };
    $scope.confirm = function () {
        //$log.info('We are confirming...');
        $modalInstance.close();
    };

});



