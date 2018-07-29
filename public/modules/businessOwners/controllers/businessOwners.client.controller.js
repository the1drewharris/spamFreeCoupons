'use strict';
var businessOwner = angular.module('businessOwner',[
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

businessOwner.controller('businessOwnersController',[
    'businessOwnerCalls',
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
    function (
        businessOwnerCalls,
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
        $filter
    ) {

        $scope.appheader = 'businessOwners';
        $scope.businessOwnerEmail = '';
        $scope.businessOwnerPassword = '';
        $scope.businessOwnerConfirmPassword = '';
        $scope.env = 'http://localhost:3000';
        $scope.credentials = '';

        var businessOwners = "",
            newBusinessOwner = '',
            businesses = '';

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
                    '<md-button aria-label="Claim Business" class="btn btn-default">claim'
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

        $scope.signIn = function(credentials) {
            delete $scope.error;
            console.log('in signIn');
            $http.post($scope.env + '/businessOwner/signIn', credentials)
                .success(function(response) {
                    console.dir(response);
                    if (response.businesses.length > 0) {
                        if (response.businesses.length > 1) {
                            console.log('list businesses here');
                        } else {
                            console.log('single business view');
                        }
                    } else {
                        console.log('load listings');
                        $scope.openPage('/listings');
                    }
                })
                .error(function(response) {
                    console.dir(response);
                    $scope.createToast('Danger');
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
                            console.log('business : ');
                            console.dir(res.data);
                            callback();
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err.data.message));
                        }
                    )
                },

                function (callback) {

                    delete $scope.error;
                    console.log('in signIn');
                    console.dir(credentials);
                    $http.post($scope.env + '/businessOwner/signIn', credentials)
                        .success(function(response) {
                            console.dir(response);
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

        $scope.claimBusiness = function (business) {
            console.log('in claim business function');
            console.dir(business);
            async.series([
                function(callback) {
                    businessListingsCalls.getSignedInBusinessOwner().then(
                        function (res) {
                            $scope.signedInBusinessOwner = res.data.businessOwner;
                            console.log('SignedInBusinessOwner : ');
                            console.dir(res.data.businessOwner)
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err.data.message));
                        }
                    );
                    businessListingsCalls.isAuth().then(
                        function (res) {
                            console.dir('isAuth data: ' + res.data);
                            $scope.auth = res.data;
                            callback()
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err.data.message));
                        }

                    );
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
                            businessOwnerAttemptClaimId: $scope.signedInBusinessOwner.id
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

        $scope.getUnclaimedBusinesses = function () {
            console.log('in getUnclaimedBusinesses function');
            businessOwnerCalls.searchBusinesses({
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
                    $scope.badBusinessOwner = 'Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message);
                    console.error('Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message));
                }
            );
        };

        /*$scope.updateItem = function (detailedclient) {
            businessOwnerCalls.updateBusiness({
                id: detailedclient.id,
                Name: detailedclient.Name,
                Address1: detailedclient.Address1,
                Address2: detailedclient.Address2,
                City: detailedclient.City,
                StateProvince: detailedclient.StateProvince,
                PostalCode: detailedclient.PostalCode,
                Country: detailedclient.Country,
                Phone: detailedclient.Phone,
                Email: detailedclient.Email,
                ResponsibleEmployee: detailedclient.ResponsibleEmployee,
                Type: detailedclient.Type.type
            }).then(
                function (res) {
                    updatedclient = angular.copy(res.data);
                    $scope.updatedclient = updatedclient;
                    $scope.getClients();

                    //window.location.href ='#/clients';
                    $scope.removeTab(detailedclient.id);
                    $scope.createToast(detailedclient.Name, "updated", "success");
                },
                function (err) {
                    console.error('Error updating client: ' + err.message);
                }
            );
        };*/

        /* =====================================================================
         * Get all businessOwners from Mongo database
         * ===================================================================== */
        $scope.getBusinessOwners = function () {
            businessOwnerCalls.getBusinessOwners({}).then(
                function (res) {
                    businessOwners = angular.copy(res.data);
                    $scope.businessOwners = businessOwners;
                    console.dir(businessOwners);
                },
                function (err) {
                    console.error('Error getting businessOwners: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * create new businessOwner
         * ===================================================================== */
        $scope.createBusinessOwner = function (newBusinessOwner) {

            async.series([
                function(callback) {

                    businessOwnerCalls.newBusinessOwner({
                        name: newBusinessOwner.businessOwnerName,
                        email: newBusinessOwner.businessOwnerEmail,
                        password: newBusinessOwner.businessOwnerPassword,
                        free: false,
                        active: false
                    }).then(
                        function (res) {

                            $scope.newBusinessOwner = {
                                email: newBusinessOwner.businessOwnerEmail,
                                password: newBusinessOwner.businessOwnerPassword
                            };

                            callback()
                        },
                        function (err) {
                            $scope.badBusinessOwner = 'Error creating businessOwner: ' + JSON.stringify(err.data.message);
                            console.error('Error creating businessOwner: ' + JSON.stringify(err.data.message));
                        }

                    );

                },

                function () {


                    $scope.signIn($scope.newBusinessOwner);

                }
            ]);

        };

        $scope.createBusinessOwnerClaim = function (newBusinessOwner) {

            async.series([
                function(callback) {

                    businessOwnerCalls.newBusinessOwner({
                        name: newBusinessOwner.businessOwnerName,
                        email: newBusinessOwner.businessOwnerEmail,
                        password: newBusinessOwner.businessOwnerPassword,
                        free: false,
                        active: false
                    }).then(
                        function (res) {

                            $scope.newBusinessOwner = {
                                email: newBusinessOwner.businessOwnerEmail,
                                password: newBusinessOwner.businessOwnerPassword
                            };

                            callback()
                        },
                        function (err) {
                            $scope.badBusinessOwner = 'Error creating businessOwner: ' + JSON.stringify(err.data.message);
                            console.error('Error creating businessOwner: ' + JSON.stringify(err.data.message));
                        }

                    );

                },

                function () {


                    $scope.signIn($scope.newBusinessOwner);

                }
            ]);

        };

    }
]);

businessOwner.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide',
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
    });
}]);
