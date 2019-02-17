'use strict';
var core = angular.module('core',[
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

core.controller('coreController',[
    'userCalls',
    'couponCalls',
    'businessesCalls',
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
        userCalls,
        couponCalls,
        businessesCalls,
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

        var businessOwners = [],
            businesses = '',
            business = '';

        $scope.businessOwnersGridOptions = {
            rowHeight: 50,
            enableSorting: true,
            columnDefs: [
                { name:'Name', field: 'name'},
                { name:'Email', field: 'email'},
                //{ name:'Password', field: 'password'},
                { name:'Free', field: 'free'},
                { name:'Active', field: 'active'},
                {
                    name: 'Impersonate',
                    displayName: 'Impersonate',
                    cellTemplate:
                        '<md-button ng-click="grid.appScope.signIn(row.entity)">'
                        + '<i class="fas fa-user fa-2x"></i>'
                        + '</md-button>',
                    width: 90
                }
            ],
            data : []
        };

        $scope.businessGridOptions = {
            rowHeight: 50,
            enableSorting: true,
            columnDefs: [
                { name:'Name', field: 'companyName'},
                { name:'Address', field: 'address'},
                { name:'City', field: 'city'},
                { name:'State', field: 'state'},
                { name:'Verify Code', field: 'verifyCode'},
                {
                    name: 'view',
                    displayName: 'View',
                    cellTemplate:
                        '<md-button ng-click="grid.appScope.openPage(\'admin/editBusiness/\' + row.entity.id)">'
                        + '<i class="fas fa-edit fa-2x"></i>'
                        + '</md-button>',
                    width: 50
                },
                {
                    name: 'claimed',
                    displayName: 'Claimed',
                    cellTemplate:
                        '<span  style="color: Green;">' +
                        '   <i ng-if="row.entity.businessOwnerId" class="fas fa-check-square fa-3x"></i>' +
                        '</span>' +
                        '<span  style="color: Red;">' +
                        '   <i ng-if="!row.entity.businessOwnerId" class="fas fa-times fa-3x"></i>' +
                        '</span>',
                    width: 60
                }
            ],
            data : []
        };

        $scope.couponGridOptions = {
            enableSorting: true,
            columnDefs: [
                { name:'Title', field: 'title'},
                { name: 'Description', field: 'description'},
                {   name:'Categories',
                    field: 'category',
                    cellTemplate:
                        '<md-chips ng-model="row.entity.category" readonly="true"></md-chips>'
                },
                {
                    name:'Status',
                    field: 'status',
                    cellTemplate:
                        '<md-switch ng-model="row.entity.status" class="category" ng-change="grid.appScope.switchChange(row.entity)" aria-label="Status" ng-true-value="\'active\'" ng-false-value="\'inactive\'">',
                    width: 60
                },
                {
                    name: 'Repeat Frequency',
                    field: 'repeatFrequency',
                    cellTemplate:
                        '   <md-button ng-if="grid.appScope.checkFrequency(row.entity.repeatFrequency, \'Sunday\')" class="md-raised">S</md-button>' +
                        '   <md-button ng-if="grid.appScope.checkFrequencyMatch(row.entity.repeatFrequency, \'Sunday\')" class="md-raised md-primary">S</md-button>' +

                        '   <md-button ng-if="grid.appScope.checkFrequency(row.entity.repeatFrequency, \'Monday\')" class="md-raised">M</md-button>' +
                        '   <md-button ng-if="grid.appScope.checkFrequencyMatch(row.entity.repeatFrequency, \'Monday\')" class="md-raised md-primary">M</md-button>' +

                        '   <md-button ng-if="grid.appScope.checkFrequency(row.entity.repeatFrequency, \'Tuesday\')" class="md-raised">T</md-button>' +
                        '   <md-button ng-if="grid.appScope.checkFrequencyMatch(row.entity.repeatFrequency, \'Tuesday\')" class="md-raised md-primary">T</md-button>' +

                        '   <md-button ng-if="grid.appScope.checkFrequency(row.entity.repeatFrequency, \'Wednesday\')" class="md-raised">W</md-button>' +
                        '   <md-button ng-if="grid.appScope.checkFrequencyMatch(row.entity.repeatFrequency, \'Wednesday\')" class="md-raised md-primary">W</md-button>' +

                        '   <md-button ng-if="grid.appScope.checkFrequency(row.entity.repeatFrequency, \'Thursday\')" class="md-raised">T</md-button>' +
                        '   <md-button ng-if="grid.appScope.checkFrequencyMatch(row.entity.repeatFrequency, \'Thursday\')" class="md-raised md-primary">T</md-button>' +

                        '   <md-button ng-if="grid.appScope.checkFrequency(row.entity.repeatFrequency, \'Friday\')" class="md-raised">F</md-button>' +
                        '   <md-button ng-if="grid.appScope.checkFrequencyMatch(row.entity.repeatFrequency, \'Friday\')" class="md-raised md-primary">F</md-button>' +

                        '   <md-button ng-if="grid.appScope.checkFrequency(row.entity.repeatFrequency, \'Saturday\')" class="md-raised">S</md-button>' +
                        '   <md-button ng-if="grid.appScope.checkFrequencyMatch(row.entity.repeatFrequency, \'Saturday\')" class="md-raised md-primary">S</md-button>',
                    width: 240
                },
                { name:'Coupon Code', field: 'couponCode'},
                {
                    name: 'Edit',
                    cellTemplate:
                        '<md-button class="btn-default" ng-click="grid.appScope.openPage(\'coupon/update/\' + row.entity.id)">' +
                        '   <i class="fas fa-pencil-alt fa-2x"></i>' +
                        '</md-button>',
                    width: 50
                }
            ],
            rowHeight: 45,
            data : []
        };


        ///////   GENERAL USEFULL  APP FUNCTIONS    //////////////////
        //////////////////////////////////////////////////////////////

        $scope.openPage = function (pageName) {
            $location.path(pageName.replace(/#/, ''));
        };
        $scope.showSignIn = function () {
            var id = $routeParams.id;
            console.log(id);
            $scope.openPage('createAccount/business/' + id)
        };

        $scope.showCreateAccount = function () {
            var id = $routeParams.id;
            console.log(id);
            $scope.openPage('signIn/business/' + id)
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

        ///// Business FUNCTIONS ///////////////

        $scope.getBusiness = function () {

            var id = $routeParams.id;
            console.log(id);
            if(id) {
                businessesCalls.searchBusinesses({
                    id: id
                }).then(
                    function (res) {
                        business = angular.copy(res.data[0]);
                        $scope.business = business;
                    },
                    function (err) {
                        $scope.badBusiness = 'Error getting business: ' + JSON.stringify(err.data.message);
                        console.error('Error getting business: ' + JSON.stringify(err.data.message));
                    }
                );
            } else {
                console.log('id undefined');
            }

        };

        $scope.getBusinesses = function () {
            businessesCalls.getBusinesses({}).then(
                function (res) {
                    businesses = angular.copy(res.data);
                    $scope.businesses = businesses;
                    console.dir(businesses);
                    $scope.businessGridOptions.data = businesses;
                },
                function (err) {
                    console.error('Error getting businessOwners: ' + err.message);
                }
            );
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
                    $scope.updatedBusiness = angular.copy(res.data);
                    //$scope.createToast(updatedBusiness.Name, "updated", "success");
                },
                function (err) {
                    console.error('Error updating business: ' + err.message);
                }
            );
        };

        $scope.claimBusiness = function (business) {
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
                                business[0].businessOwnerAttemptClaimId.push(businessOwnerIdObj);
                                callback();
                            },
                            function (err) {
                                console.error('Error : ' + JSON.stringify(err));
                            }
                        );
                    } else {
                        console.log('business id : ');
                        console.dir(business[0].id);
                        $scope.openPage('signIn/business/' + business[0].id);
                        console.log('open page sign in passed')
                    }

                },

                function (callback) {
                    if ($scope.auth) {
                        businessListingsCalls.updateBusinessOwner({
                            id: $scope.signedInBusinessOwner.id,
                            businessId: business[0].id
                        }).then(
                            function (res) {
                                $scope.updatedBusinessOwner = res.data;
                            },
                            function (err) {
                                console.error('Error updating business owner : ' + JSON.stringify(err.data.message));
                            }
                        );

                        businessListingsCalls.updateBusiness({
                            id: business[0].id,
                            businessOwnerAttemptClaimId: business[0].businessOwnerAttemptClaimId
                        }).then(
                            function (res) {
                                $scope.updatedBusiness = res.data;
                            },
                            function (err) {
                                console.error('Error updating business : ' + JSON.stringify(err.data.message));
                            }
                        );

                        businessListingsCalls.setCode({
                            id: business[0].id
                        }).then(
                            function (res) {
                                $scope.verifyCode = res.data.verifyCode;
                                callback()
                            },
                            function (err) {
                                console.error('Error setting verifyCode for business : ' + business[0].id + JSON.stringify(err.data.message));
                            }

                        )

                    } else {
                        $scope.openPage('signIn/business/' + business[0].id);
                    }
                },

                function () {
                    businessListingsCalls.sendCode(business[0]).then(
                        function (res) {
                            $scope.sentCode = res.body;
                            $scope.openPage('business/claim/' + business[0].id);
                        },
                        function (err) {
                            console.error('Error sending verifyCode for business : ' + business[0].id + JSON.stringify(err.data.message));
                        }
                    )
                }
            ]);
        };

        ///// AUTHENICATION FUNCTIONS ///////////////



        ///// Business Owner FUNCTIONS ///////////////

        /* =====================================================================
         * Get all businessOwners from Mongo database
         * ===================================================================== */
        $scope.getBusinessOwners = function () {
            userCalls.getUsers({}).then(
                function (res) {

                    angular.copy(res.data).forEach(function (user) {
                        user.roles.forEach(function (role) {
                            if (role == "businessOwner") {
                                businessOwners.push(user);
                            }
                        })
                    });

                    $scope.businessOwners = businessOwners;
                    console.dir(businessOwners);
                    $scope.businessOwnersGridOptions.data = businessOwners;
                },
                function (err) {
                    console.error('Error getting businessOwners: ' + err.message);
                }
            );
        };

        $scope.getUnclaimedBusinesses = function () {

            async.series([

                function(callback) {
                    businessOwnerCalls.isAuth().then(
                        function (res) {
                            console.dir('isAuth data: ' + res.data);
                            $scope.auth = res.data;
                            callback();
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err.data.message));
                        }
                    )
                },

                function() {
                    if ($scope.auth) {
                        businessOwnerCalls.searchBusinesses({
                            dateClaimed: undefined
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
                    } else {
                        $scope.openPage('signIn');
                    }

                }

            ]);

        };





    }
]);

core.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide',
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
    });
}]);
