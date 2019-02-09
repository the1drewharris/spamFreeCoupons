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
            businesses = '';

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
                /*{
                    name: 'view',
                    displayName: 'View',
                    cellTemplate:
                        '<md-button ng-click="grid.appScope.openPage(\'admin/view/business/\' + row.entity.id)">'
                        + '<i class="fas fa-edit fa-2x"></i>'
                        + '</md-button>',
                    width: 50
                },*/
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
