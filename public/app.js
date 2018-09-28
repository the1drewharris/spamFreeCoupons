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
    'businessListings',
    'businessOwners',
    'businesses'
    //FIXME: prevent injector error
    , 'coupons'

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
    $scope.env = 'http://localhost:3000';

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

app.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide', // or 'fade'
        verticalPosition: 'top',
        horizontalPosition: 'right'
    });
}]);



