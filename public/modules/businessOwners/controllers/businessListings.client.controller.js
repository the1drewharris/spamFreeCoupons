'use strict';
var businessListing = angular.module('businessListing',[
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
    'gm.typeaheadDropdown'
]);

businessListing.controller('businessListingsController',[
    'businessListingsCalls',
    '$scope',
    '$http',
    '$location',
    '$mdDialog',
    '$mdSidenav',
    '$mdToast',
    '$rootScope',
    '$routeParams',
    'ngToast',
    '$sce',
    'lodash',
    'uiGridConstants',
    '$filter',
    '$window',
    function (
        businessListingsCalls,
        $scope,
        $http,
        $location,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $routeParams,
        ngToast,
        $sce,
        lodash,
        uiGridConstants,
        $filter,
        $window
    ) {

        console.log('in businessListingsController');
        $scope.appheader = 'businessOwners';
        $scope.businessOwnerEmail = '';
        $scope.businessOwnerPassword = '';
        $scope.businessOwnerConfirmPassword = '';
        $scope.env = 'http://localhost:3000';
        $scope.credentials = '';

        var businesses = '';

        $scope.gridOptions = {
            rowHeight: 50,
            enableSorting: true,
            columnDefs: [
                { name:'Name', field: 'companyName'},
                { name:'Address', field: 'address'},
                { name:'City', field: 'city'},
                { name:'State', field: 'state'},
                {
                    name: 'claim',
                    displayName: 'Claim',
                    cellTemplate:
                    '<md-button aria-label="Claim Business" class="btn btn-default" ng-click="claimBusiness(row.entity)">claim'
                    + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 70,
                    pinnable: false
                }
            ],
            data : []
        };

        $scope.openPage = function (pageName) {
            $location.path(pageName.replace(/#/, ''));
        };

        $scope.claimBusiness = function (business) {
            businessListingsCalls.updateBusiness();
            if (businessListingsCalls.isAuth()) {

            }
        };

        $scope.refreshData = function (keyword) {
            $scope.gridOptions.data = $scope.businesses;
            while (keyword) {
                var oSearchArray = keyword.split(' ');
                $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, oSearchArray[0], undefined);
                oSearchArray.shift();
                keyword = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
            }
        };

        $scope.sendVerifyCode = function (business) {
            if ($scope.isAuth()) {
                $http.post($scope.env + '/business/setCode', business)
                    .success(function(response) {
                        $scope.code = response

                    })
                    .error(function(response) {
                        console.dir(response);
                    });
                businessListingsCalls.claimBusiness({

                })
            } else {
                //load Sign In page
            }
        };

        $scope.logout = function () {
            $window.open('/businessOwner/signOut', "_self");
        };

        $scope.isAuth = function () {
            businessListingsCalls.isAuth().then(
                function (res) {
                    console.dir('isAuth data: ' + res.data);
                    $scope.auth = res.data;
                },
                function (err) {
                    console.error('Error : ' + JSON.stringify(err.data.message));
                }
            )
        };

        $scope.getUnclaimedBusinesses = function () {
            console.log('in getUnclaimedBusinesses function');
            businessListingsCalls.searchBusinesses({
                dateClaimed: undefined
            }).then(
                function (res) {
                    businesses = angular.copy(res.data);
                    $scope.businesses = businesses;
                    console.dir($scope.businesses);
                    console.dir($scope.gridOptions.data);
                    $scope.gridOptions.data = res.data;
                    console.dir($scope.gridOptions.data);
                },
                function (err) {
                    $scope.badBusinessOwner = 'Error creating businessOwner: ' + JSON.stringify(err.data.message);
                    console.error('Error creating businessOwner: ' + JSON.stringify(err.data.message));
                }
            );
        };
    }
]);