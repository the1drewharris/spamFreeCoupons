'use strict';
var admin = angular.module('admin',[
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

admin.controller('adminController',[
    'adminCalls',
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
        adminCalls,
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

        $scope.appheader = 'admin';
        $scope.env = 'http://localhost:3000';
        $scope.credentials = '';

        $scope.businessOwnersGridOptions = {
            rowHeight: 50,
            enableSorting: true,
            columnDefs: [
                { name:'Name', field: 'name'},
                { name:'Email', field: 'email'},
                { name:'Password', field: 'password'},
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

        $scope.gridOptions = {
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
                        '<md-button ng-click="grid.appScope.openPage(\'admin/view/business/\' + row.entity.id)">'
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

        $scope.openPage = function (pageName) {
            $location.path(pageName.replace(/#/, ''));
        };

        $scope.checkAuth = function () {
            adminCalls.isAuth().then(
                function (res) {
                    console.dir('isAuth data: ' + res.data);
                    $scope.auth = res.data;
                    if (!$scope.auth) {
                        $scope.openPage('admin/signIn');
                    }
                },
                function (err) {
                    console.error('Error : ' + JSON.stringify(err.data.message));
                }
            );

        };

        $scope.logout = function () {
            $window.open('/admin/signOut', "_self");
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

        $scope.signIn = function(credentials) {
            delete $scope.error;
            console.log('in signIn');
            console.dir(credentials);
            $http.post($scope.env + '/businessOwner/SignIn', credentials)
                .success(function(response) {
                    console.dir(response);
                    if (response.businesses.length > 0) {
                        if (response.businesses.length > 1) {
                            console.log('list businesses here');
                            $scope.openPage('view/businesses');
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

        $scope.adminSignIn = function(credentials) {
            delete $scope.error;
            $http.post($scope.env + '/admin/signIn', credentials)
                .success(function(response) {
                    $scope.openPage('/admin/view/businesses')
                })
                .error(function(response) {
                    console.dir(response);
                    //$scope.createToast('Danger');
                });
        };

        /* =====================================================================
         * Get all businessOwners from Mongo database
         * ===================================================================== */
        $scope.getBusinessOwners = function () {
            adminCalls.getBusinessOwners({}).then(
                function (res) {
                    businessOwners = angular.copy(res.data);
                    $scope.businessOwners = businessOwners;
                    console.dir(businessOwners);
                    $scope.businessOwnersGridOptions.data = res.data;
                },
                function (err) {
                    console.error('Error getting businessOwners: ' + err.message);
                }
            );
        };

        $scope.getBusiness = function () {

            var id = $routeParams.id;
            console.log(id);
            if(id) {
                adminCalls.searchBusinesses({
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

        $scope.editBusiness = function (newBusiness) {
            console.log(newBusiness);
            adminCalls.updateBusiness({
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

        $scope.createBusiness = function (newBusiness) {
            console.dir(newBusiness);
            adminCalls.newBusiness({
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
                    $scope.getBusinesses();
                    $scope.openPage('admin/view/businesses');
                },
                function (err) {
                    $scope.badBusiness = 'Error creating business: ' + JSON.stringify(err.data.message);
                    console.error('Error creating business: ' + JSON.stringify(err.data.message));
                }
            );
        };

        $scope.getBusinesses = function () {
            adminCalls.getBusinesses({}).then(
                function (res) {
                    businesses = angular.copy(res.data);
                    $scope.businesses = businesses;
                    console.dir(businesses);
                    $scope.gridOptions.data = res.data;
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


                    $scope.signInClaim($scope.newBusinessOwner);

                }
            ]);

        };

    }
]);


admin.directive("importSheetJs", [SheetJSImportDirective]);

function SheetJSImportDirective() {
    return {
        scope: { opts: '=', createBusiness: '&callbackFn' },
        link: function ($scope, $elm) {
            $elm.on('change', function (changeEvent) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    /* read workbook */
                    var bstr = e.target.result;
                    var workbook = XLSX.read(bstr, {type:'binary'});
                    var d = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

                    console.dir(d);

                    d.forEach(function(element) {
                        console.log(element);
                        $scope.createBusiness({newBusiness: element});
                    });
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    };
}