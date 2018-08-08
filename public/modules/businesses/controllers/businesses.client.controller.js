'use strict';
var business = angular.module('business',[
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

business.controller('businessesController',[
    'businessesCalls',
    'businessListingsCalls',
    '$scope',
    '$http',
    '$location',
    '$mdDialog',
    '$mdSidenav',
    '$mdToast',
    '$rootScope',
    '$routeParams',
    '$sce',
    'lodash',
    'uiGridConstants',
    '$filter',
    '$window',
    function (
        businessesCalls,
        businessListingsCalls,
        $scope,
        $http,
        $location,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $routeParams,
        $sce,
        lodash,
        uiGridConstants,
        $filter,
        $window
    ) {

        $scope.appheader = 'business';

        var businesses = "",
            newbusiness = '',
            employees = "",
            updatedBusiness = "";

        var now = (new Date()).valueOf().toString();

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
                { name:'Name', field: 'companyName'},
                { name:'Address', field: 'address'},
                { name:'City', field: 'city'},
                { name:'State', field: 'state'},
                {
                    name: 'edit',
                    displayName: 'Edit',
                    cellTemplate:
                        '<md-button aria-label="Edit Business" class="fa fa-pencil" ng-click="grid.appScope.openPage(\'business/view/\' + row.entity.id)">edit'
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

        $scope.showAddCoupon = function () {
            var id = $routeParams.id;
            $scope.openPage('coupon/create/' + id)
        };

        $scope.showViewCoupon = function () {
            var id = $routeParams.id;
            $scope.openPage('coupons/view/' + id)
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

        $scope.getClaimedBusinesses = function () {
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
                    if ($scope.auth) {
                        businessListingsCalls.getSignedInBusinessOwner().then(
                            function (res) {
                                $scope.signedInBusinessOwner = res.data.businessOwner;
                                console.log('SignedInBusinessOwner : ');
                                console.dir(res.data.businessOwner);
                                callback();
                            },
                            function (err) {
                                console.error('Error : ' + JSON.stringify(err));
                            }
                        );
                    } else {
                        $scope.openPage('signIn');
                    }

                },


                function () {
                    businessListingsCalls.searchBusinesses({
                        businessOwnerId: $scope.signedInBusinessOwner.id
                    }).then(
                        function (res) {
                            businesses = angular.copy(res.data);
                            $scope.businesses = businesses;
                            $scope.gridOptions.data = res.data;
                        },
                        function (err) {
                            $scope.badBusinessOwner = 'Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message);
                            console.error('Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message));
                        }
                    );
                }
            ]);
        };

        $scope.getBusiness = function () {
            var id = $routeParams.id;
            console.log(id);
            if(id && id !== undefined) {
                businessesCalls.searchBusinesses({
                    id: id
                }).then(
                    function (res) {
                        business = angular.copy(res.data[0]);
                        $scope.business = business;
                    },
                    function (err) {
                        $scope.badBusiness = 'Error creating businessOwner: ' + JSON.stringify(err.data.message);
                        console.error('Error creating businessOwner: ' + JSON.stringify(err.data.message));
                    }
                );
            } else {
                console.log('undefined');
            }

        };

        $scope.finishClaimBusiness = function (verifyCode) {

            var id = $routeParams.id;
            async.series([
                function(callback) {

                    if(id && id !== undefined) {

                        businessesCalls.searchBusinesses({
                            id: id
                        }).then(
                            function (res) {
                                business = angular.copy(res.data[0]);
                                $scope.business = business;
                            },
                            function (err) {
                                $scope.badBusiness = 'Error creating businessOwner: ' + JSON.stringify(err.data.message);
                                console.error('Error creating businessOwner: ' + JSON.stringify(err.data.message));
                            }
                        );

                        businessesCalls.getSignedInBusinessOwner().then(
                            function (res) {
                                $scope.signedInBusinessOwner = res.data.businessOwner;
                                var businessIdObj = {id: id};
                                $scope.signedInBusinessOwner.businesses.push(businessIdObj);
                                callback();
                            },
                            function (err) {
                                console.error('Error : ' + JSON.stringify(err.data.message));
                            }
                        );

                    } else {
                        console.log('undefined');
                    }
                },

                function (callback) {

                    if(verifyCode === $scope.business.verifyCode) {
                        businessesCalls.updateBusinessOwner({
                            id: $scope.signedInBusinessOwner.id,
                            businesses: $scope.signedInBusinessOwner.businesses
                        }).then(
                           function (res) {
                               $scope.updatedBusinessOwner = angular.copy(res.data);
                           },
                           function (err) {
                               $scope.badBusiness = 'Error updating businessOwner: ' + JSON.stringify(err.data.message);
                               console.error('Error updating businessOwner: ' + JSON.stringify(err.data.message));
                           }
                       );

                        businessesCalls.updateBusiness({
                            id: id,
                            businessOwnerId: $scope.signedInBusinessOwner.id,
                            dateClaimed: now,
                            businessOwnerAttemptClaimId: []
                        }).then(
                            function (res) {
                                $scope.updatedBusiness = res.data;
                                callback();
                            },
                            function (err) {
                                console.error('Error updating business : ' + JSON.stringify(err.data.message));
                            }
                        );

                   } else {
                       console.log('codes don\'t match')
                   }

                },
                function() {
                    $scope.openPage('business/view/' + id);
                }
            ]);

        };
        $scope.editBusiness = function (newBusiness) {
            console.log(newBusiness);
            businessesCalls.updateBusiness({
                id: newBusiness.id,
                companyName: newBusiness.companyName,
                address: newBusiness.address,
                city: newBusiness.city,
                state: newBusiness.state,
                postalCode: newBusiness.postalCode,
                phone: newBusiness.phone,
                websiteURL: newBusiness.websiteURL,
                facebook: newBusiness.facebook,
                instagram: newBusiness.instagram,
                twitter: newBusiness.twitter

            }).then(
                function (res) {
                    updatedBusiness = angular.copy(res.data);
                    $scope.updatedBusiness = updatedBusiness;
                    //$scope.createToast(updatedBusiness.Name, "updated", "success");
                },
                function (err) {
                    console.error('Error updating client: ' + err.message);
                }
            );
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

        /* =====================================================================
         * Get all businesses from Mongo database
         * ===================================================================== */
        $scope.getBusinesses3 = function () {

            businessesCalls.getBusinesses({}).then(
                function (res) {
                    businesses = angular.copy(res.data);
                    $scope.businesss = businesses;
                    console.dir(businesses);
                    $scope.gridOptions.data = businesses;
                },
                function (err) {
                    console.error('Error getting businesses: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * create new business
         * ===================================================================== */
        $scope.createBusiness = function (newBusiness) {
            businessesCalls.newBusiness({
                id: newBusiness.id,
                companyName: newBusiness.companyName,
                address: newBusiness.address,
                city: newBusiness.city,
                state: newBusiness.state,
                postalCode: newBusiness.postalCode,
                phone: newBusiness.phone,
                websiteURL: newBusiness.websiteURL,
                facebook: newBusiness.facebook,
                instagram: newBusiness.instagram,
                twitter: newBusiness.twitter
            }).then(
                function (res) {
                    newBusiness = angular.copy(res.data);
                    $scope.openPage('listings')
                },
                function (err) {
                    $scope.badBusiness = 'Error creating business: ' + JSON.stringify(err.data.message);
                    console.error('Error creating business: ' + JSON.stringify(err.data.message));
                }
            );
        };

    }
]);
