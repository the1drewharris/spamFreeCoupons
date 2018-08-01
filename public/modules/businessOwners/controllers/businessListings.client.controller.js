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
                    '<md-button aria-label="Claim Business" class="btn btn-default" ng-click="grid.appScope.claimBusiness(row.entity)">claim'
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
            console.log('in claim business function');
            console.dir(business);
            async.series([

                function(callback) {

                    businessListingsCalls.isAuth().then(
                        function (res) {
                            console.dir('isAuth data: ' + res.data);
                            $scope.auth = res.data;
                            callback();
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err.data.message));
                        }

                    );
                },

                function(callback) {
                    console.dir('isAuth data: ' + $scope.auth);
                    if ($scope.auth) {
                        businessListingsCalls.getSignedInBusinessOwner().then(
                            function (res) {
                                $scope.signedInBusinessOwner = res.data.businessOwner;
                                console.log('SignedInBusinessOwner : ');
                                console.dir(res.data.businessOwner);
                                var businessOwnerIdObj = {id: $scope.signedInBusinessOwner.id};
                                business.businessOwnerAttemptClaimId.push(businessOwnerIdObj);
                                callback();
                            },
                            function (err) {
                                console.error('Error : ' + JSON.stringify(err));
                            }
                        );
                    } else {
                        console.log('business id : ');
                        console.dir(business.id);
                        $scope.openPage('signIn/business/' + business.id);
                        console.log('open page sign in passed')
                    }

                },


                function (callback) {
                    if ($scope.auth) {

                        console.log('authorized');
                        businessListingsCalls.updateBusinessOwner({
                            id: $scope.signedInBusinessOwner.id,
                            businessId: business.id
                        }).then(
                            function (res) {
                                $scope.updatedBusinessOwner = res.data;
                            },
                            function (err) {
                                console.error('Error updating business owner : ' + JSON.stringify(err.data.message));
                            }
                        );

                        businessListingsCalls.updateBusiness({
                            id: business.id,
                            businessOwnerAttemptClaimId: business.businessOwnerAttemptClaimId
                        }).then(
                            function (res) {
                                $scope.updatedBusiness = res.data;
                            },
                            function (err) {
                                console.error('Error updating business : ' + JSON.stringify(err.data.message));
                            }
                        );

                        businessListingsCalls.setCode({
                            id: business.id
                        }).then(
                            function (res) {
                                $scope.verifyCode = res.data.verifyCode;
                                callback()
                            },
                            function (err) {
                                console.error('Error setting verifyCode for business : ' + business.id + JSON.stringify(err.data.message));
                            }

                        )

                    } else {
                        console.log('business id : ');
                        console.dir(business.id);
                        $scope.openPage('signIn/business/' + business.id);
                        console.log('open page sign in passed')
                    }
                },

                function () {
                    businessListingsCalls.sendCode(business).then(
                        function (res) {
                            console.log('sent code');
                            $scope.sentCode = res.body;
                            $scope.openPage('business/claim/' + business.id);
                        },
                        function (err) {
                            console.error('Error sending verifyCode for business : ' + business.id + JSON.stringify(err.data.message));
                        }
                    )
                }
            ]);
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
            businessListingsCalls.searchBusinesses({
                dateClaimed: undefined
            }).then(
                function (res) {
                    businesses = angular.copy(res.data);
                    $scope.businesses = businesses;
                    $scope.gridOptions.data = res.data;
                },
                function (err) {
                    $scope.badBusinessOwner = 'Error creating businessOwner: ' + JSON.stringify(err.data.message);
                    console.error('Error creating businessOwner: ' + JSON.stringify(err.data.message));
                }
            );
        };
    }
]);