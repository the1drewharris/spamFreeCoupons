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
        $scope.items = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        $scope.selected = [];
        $scope.categories = [];

        var self = this;

        self.categories = loadCategories();
        self.selectedCategories = [];

        var businessOwners = [],
            businesses = '',
            business = '',
            coupons = "",
            coupon;

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

        $scope.claimedBusinessGridOptions = {
            rowHeight: 50,
            enableSorting: true,
            columnDefs: [
                { name:'Name', field: 'companyName'},
                { name:'Address', field: 'address'},
                { name:'City', field: 'city'},
                { name:'State', field: 'state'},
                {
                    name: 'view',
                    displayName: 'View',
                    cellTemplate:
                        '<md-button ng-click="grid.appScope.openPage(\'businessOwner/editBusiness/\' + row.entity.id)">'
                        + '<i class="fas fa-edit fa-2x"></i>'
                        + '</md-button>',
                    width: 50
                }
            ],
            data : []
        };

        $scope.unclaimedBusinessGridOptions = {
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
                        '<md-button aria-label="Claim Business" class="btn btn-default" ng-click="grid.appScope.claimBusiness(row.entity)"><i class="fas fa-check-square fa-2x"></i>'
                        + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 50,
                    pinnable: false
                }
            ],
            data : []
        };

        $scope.allCouponsGridOptions = {
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
                        '<md-button class="btn-default" ng-click="grid.appScope.openPage(\'admin/editCoupon/\' + row.entity.id)">' +
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

        $scope.getBusinessOwnersBusinesses = function () {

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

        $scope.createBusiness = function (newBusiness) {
            //console.dir(newBusiness);
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
                    $scope.getBusinesses();
                    $scope.openPage('admin/viewBusinesses');
                },
                function (err) {
                    $scope.badBusiness = 'Error creating business: ' + JSON.stringify(err.data.message);
                    console.error('Error creating business: ' + JSON.stringify(err.data.message));
                }
            );
        };

        $scope.getUnclaimedBusinesses = function () {
            console.log("in getUnclaimedBusinesses");
            businessesCalls.searchBusinesses({
                dateClaimed: ""
            }).then(
                function (res) {
                    businesses = angular.copy(res.data);
                    console.dir(businesses);
                    $scope.businesses = businesses;
                    $scope.unclaimedBusinessGridOptions.data = res.data;
                },
                function (err) {
                    $scope.badBusinessOwner = 'Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message);
                    console.error('Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message));
                }
            );
        };

        $scope.getClaimedBusinesses = function () {

            async.series([
                function(callback) {

                    userCalls.getSignedInUser({}).then(
                        function (res) {

                            //console.dir(res.data.user);
                            $scope.user = res.data.user;
                            callback();

                        },
                        function (err) {
                            console.error('Error getting users: ' + err.message);
                        }
                    );

                },
                function() {

                    businessesCalls.searchBusinesses({
                        businessOwnerId: $scope.user.id
                    }).then(
                        function (res) {
                            businesses = angular.copy(res.data);
                            //console.dir(res.data);
                            $scope.businesses = businesses;
                            $scope.claimedBusinessGridOptions.data = res.data;
                            if ($scope.businesses.length === 0) {
                                $scope.openPage('businessOwner/claimBusinesses');
                            }
                            if ($scope.businesses.length === 1) {

                                $scope.openPage('businessOwner/editBusiness/' + $scope.businesses[0].id);

                            }
                        },
                        function (err) {
                            $scope.badBusiness = 'Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message);
                            console.error('Error getting UnclaimedBusinesses: ' + JSON.stringify(err.data.message));
                        }
                    );

                }

            ]);

        };

        $scope.getBusinesses = function () {
            console.log('in getBusiness');
            businessesCalls.getBusinesses({}).then(
                function (res) {
                    businesses = angular.copy(res.data);
                    $scope.businesses = businesses;
                    //console.dir(businesses);
                    $scope.businessGridOptions.data = businesses;
                },
                function (err) {
                    console.error('Error getting businessOwners: ' + err.message);
                }
            );
        };

        $scope.editBusiness = function (newBusiness) {
            //console.log(newBusiness);
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
            //console.dir(business);
            async.series([
                function(callback) {
                    userCalls.getSignedInUser().then(
                        function (res) {
                            $scope.user = res.data.user;

                            callback();
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err));
                        }
                    );

                },

                function(callback) {

                    businessesCalls.setCode({
                        id: business.id
                    }).then(
                        function (res) {
                            $scope.verifyCode = res.data.verifyCode;
                            var userObj = {
                                id: $scope.user.id
                            };
                            business.businessOwnerAttemptClaimId.push(userObj);
                            callback();
                        },
                        function (err) {
                            console.error('Error setting verifyCode for business : ' + business.id + JSON.stringify(err.data.message));
                        }

                    )

                },

                function (callback) {
                    userCalls.updateUser({
                        id: $scope.user.id,
                        businessId: business.id
                    }).then(
                        function (res) {
                            $scope.updatedBusinessOwner = res.data;
                        },
                        function (err) {
                            console.error('Error updating business owner : ' + JSON.stringify(err.data.message));
                        }
                    );

                    businessesCalls.updateBusiness({
                        id: business.id,
                        businessOwnerAttemptClaimId: business.businessOwnerAttemptClaimId
                    }).then(
                        function (res) {
                            $scope.updatedBusiness = res.data;
                            callback();
                        },
                        function (err) {
                            console.error('Error updating business : ' + JSON.stringify(err.data.message));
                        }
                    );


                },

                function () {
                    businessesCalls.sendCode(business).then(
                        function (res) {
                            $scope.sentCode = res.body;
                            $scope.openPage('businessOwner/claim/' + business.id);
                        },
                        function (err) {
                            console.error('Error sending verifyCode for business : ' + business.id + JSON.stringify(err.data.message));
                        }
                    )
                }
            ]);
        };

        $scope.finishClaimBusiness = function (verifyCode) {

            var id = $routeParams.id;
            async.series([
                function(callback) {

                    if(id || id !== undefined) {

                        businessesCalls.searchBusinesses({
                            id: id
                        }).then(
                            function (res) {
                                business = angular.copy(res.data[0]);
                                $scope.business = business;
                                callback();
                            },
                            function (err) {
                                $scope.badBusiness = 'Error creating businessOwner: ' + JSON.stringify(err.data.message);
                                console.error('Error creating businessOwner: ' + JSON.stringify(err.data.message));
                            }
                        );

                    } else {
                        console.log('undefined');
                    }
                },

                function (callback) {

                    userCalls.getSignedInUser().then(
                        function (res) {
                            $scope.user = res.data.user;
                            var businessIdObj = {id: $scope.business.id};
                            $scope.user.businesses.push(businessIdObj);
                            callback();
                        },
                        function (err) {
                            console.error('Error : ' + JSON.stringify(err.data.message));
                        }
                    );

                },

                function (callback) {

                    if(verifyCode === $scope.business.verifyCode) {
                        userCalls.updateUser({
                            id: $scope.user.id,
                            businesses: $scope.user.businesses
                        }).then(
                            function (res) {
                                $scope.updatedUser = angular.copy(res.data);
                            },
                            function (err) {
                                $scope.badUser = 'Error updating user: ' + JSON.stringify(err.data.message);
                                console.error('Error updating user: ' + JSON.stringify(err.data.message));
                            }
                        );

                        businessesCalls.updateBusiness({
                            id: id,
                            businessOwnerId: $scope.user.id,
                            dateClaimed: new Date(),
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
                    $scope.openPage('businessOwner/home');
                }
            ]);

        };

        $scope.deleteBusiness = function () {

            var id = $routeParams.id;
            //console.log(id);
            if(id) {
                businessesCalls.deleteBusiness({
                    id: id
                }).then(
                    function (res) {
                        business = angular.copy(res.data);
                        $scope.business = business;
                    },
                    function (err) {
                        $scope.badBusiness = 'Error deleting business: ' + JSON.stringify(err.data.message);
                        console.error('Error deleting business: ' + JSON.stringify(err.data.message));
                    }
                );

                couponCalls.deleteBCoupons({
                    businessId: id
                }).then(
                    function (res) {
                        coupon = angular.copy(res.data);
                        $scope.coupon = coupon;
                    },
                    function (err) {
                        $scope.badCoupon = 'Error deleting coupons: ' + JSON.stringify(err.data.message);
                        console.error('Error deleting coupons: ' + JSON.stringify(err.data.message));
                    }
                )

            } else {
                console.log('id undefined');
            }

            $scope.openPage('admin/viewBusinesses');

        };


        ///// Coupon FUNCTIONS ///////////////

        $scope.showBusiness = function () {
            var id = $routeParams.id;
            $scope.openPage('admin/editBusiness/' + id)
        };

        $scope.showAddCoupon = function () {
            var id = $routeParams.id;
            $scope.openPage('admin/addCoupon/' + id)
        };

        $scope.showViewCoupon = function () {
            var id = $routeParams.id;
            $scope.openPage('admin/business/viewCoupons/' + id)
        };

        $scope.checkFrequency = function(repeatFrequency, day) {
            var state = true;
            repeatFrequency.forEach(foo);
            function foo(item){
                if (item === day) {
                    state = false
                }
            }
            return state
        };

        $scope.checkFrequencyMatch = function(repeatFrequency, day) {
            var state = false;
            repeatFrequency.forEach(foo);
            function foo(item){
                if (item === day) {
                    state = true
                }
            }
            return state
        };

        $scope.getCoupons = function () {
            couponCalls.getCoupons().then(
                function (res) {
                    coupons = angular.copy(res.data);
                    $scope.coupons = coupons;
                    $scope.allCouponsGridOptions.data = res.data
                },
                function (err) {
                    $scope.badCoupon = 'Error getting coupon: ' + JSON.stringify(err.data.message);
                    console.error('Error getting coupon: ' + JSON.stringify(err.data.message));
                }
            );
        };

        $scope.getBusinessCoupons = function () {

            var id = $routeParams.id;
            couponCalls.searchCoupons({
                businessId: id
            }).then(
                function (res) {
                    coupons = angular.copy(res.data);
                    $scope.coupons = coupons;
                    $scope.allCouponsGridOptions.data = coupons;
                },
                function (err) {
                    console.error('Error getting coupons: ' + err.message);
                }
            );

        };

        $scope.editCoupon = function (updatedCoupon) {

            //console.dir(updatedCoupon.category);
            updatedCoupon.category.forEach(function (item) {
                if (item.name) {
                    $scope.categories.push(item.name);
                }
                else {
                    $scope.categories.push(item);
                }
                //console.dir(item)
            });

           // console.dir(updatedCoupon);
            couponCalls.updateCoupon({
                id: updatedCoupon.id,
                title: updatedCoupon.title,
                description: updatedCoupon.description,
                repeatFrequency: $scope.selected,
                category: $scope.categories,
                status: updatedCoupon.status,
                couponCode: updatedCoupon.couponCode,
                postalCode: updatedCoupon.postalCode

            }).then(
                function (res) {
                    updatedCoupon = angular.copy(res.data.results);
                    $scope.updatedCoupon = updatedCoupon;
                    //console.dir(updatedCoupon);
                    $scope.openPage('admin/business/viewCoupons/' + updatedCoupon.businessId);
                    //$scope.createToast(updatedCoupon.Name, "updated", "success");
                },
                function (err) {
                    console.error('Error updating coupon: ' + err.message);
                }
            );

        };


        $scope.createCoupon = function (newCoupon) {
            var id = $routeParams.id;


            async.series([

                function(callback) {

                    businessesCalls.getBusiness({
                        id: id
                    }).then(
                        function (res) {
                            $scope.business = res.data;
                            callback();
                        },
                        function (err) {
                            $scope.badCoupon = 'Error getting business: ' + JSON.stringify(err.data.message);
                            console.error('Error getting business: ' + JSON.stringify(err.data.message));
                        }
                    )

                },

                function(callback) {

                    //console.dir($scope.selectedCategories);
                    $scope.selectedCategories.forEach(function (item) {
                        $scope.categories.push(item.name);
                        //console.dir(item)
                    });
                    //console.dir($scope.categories);
                    //console.dir($scope.selectedCategories);
                    //console.dir(newCoupon);

                    couponCalls.newCoupon({
                        title: newCoupon.title,
                        description: newCoupon.description,
                        couponCode: newCoupon.couponCode,
                        category: $scope.categories,
                        status: newCoupon.status,
                        repeatFrequency: $scope.selected,
                        businessId: id,
                        postalCode: $scope.business[0].postalCode
                    }).then(
                        function (res) {
                            newCoupon = angular.copy(res.data);
                            $scope.newCoupon = newCoupon;
                            $scope.openPage('business/view/' + id);
                            callback();
                        },
                        function (err) {
                            $scope.badCoupon = 'Error creating coupon: ' + JSON.stringify(err.data.message);
                            console.error('Error creating coupon: ' + JSON.stringify(err.data.message));
                        }
                    );

                },

                function(callback) {

                    var couponIdObj = {id: $scope.newCoupon.id};
                    $scope.business[0].coupons.push(couponIdObj);
                    callback();

                },

                function() {

                    businessesCalls.updateBusiness({
                        id: id,
                        coupons: $scope.business[0].coupons
                    }).then(
                        function (res) {
                            $scope.newBusiness = angular.copy(res.data);
                            $scope.openPage('admin/editBusiness/' + id);
                        },
                        function (err) {
                            $scope.badBusiness = 'Error updating Business: ' + JSON.stringify(err.data.message);
                            console.error('Error updating Business: ' + JSON.stringify(err.data.message));
                        }
                    )

                }
            ]);



        };


        $scope.isChecked = function() {
            return $scope.selected.length === $scope.items.length;
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.toggleAll = function() {
            if ($scope.selected.length === $scope.items.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.items.slice(0);
            }
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        $scope.selectItem = function (item, list) {
            var id = $routeParams.couponId;
            async.series([

                function(callback) {

                    couponCalls.searchCoupons({
                        id: id
                    }).then(
                        function (res) {
                            coupon = angular.copy(res.data);
                            $scope.coupon = coupon[0];
                            callback();
                        },
                        function (err) {
                            $scope.badCoupon = 'Error getting coupon: ' + JSON.stringify(err.data.message);
                            console.error('Error getting coupon: ' + JSON.stringify(err.data.message));
                        }
                    )

                },

                function() {

                    $scope.coupon.repeatFrequency.forEach(
                        function(currentValue) {
                            if (currentValue === item) {
                                list.push(item)
                            }
                        }
                    )
                }
            ]);



        };

        function loadCategories () {
            var categories = [
                {
                    'name': 'Food'
                },
                {
                    'name': 'Beauty'
                },
                {
                    'name': 'Health'
                },
                {
                    'name': 'Automotive'
                },
                {
                    'name': 'Home Improvement'
                },
                {
                    'name': 'Entertainment'
                },
                {
                    'name': 'Legal'
                }
            ];


            return categories.map(function (cat) {
                cat.lowername = cat.name.toLowerCase();
                return cat;
            });
        }

        $scope.transformChip = function (chip) {
            $scope.selectedCategories = self.selectedCategories;
            return chip;
        };

        $scope.querySearch = function (query) {
            var results = query ? self.categories.filter($scope.createFilterFor(query)) : [];
            return results;
        };

        $scope.createFilterFor = function (query) {
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(category) {
                return (category.lowername.indexOf(lowercaseQuery) === 0);
            };

        };

        $scope.switchChange = function (coupon) {
            couponCalls.updateCoupon({
                id: coupon.id,
                status: coupon.status
            }).then(
                function (res) {
                    $scope.updatedCoupon = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error updating coupon: ' + err.message);
                }
            );
        };


        ///// AUTHENICATION FUNCTIONS ///////////////

        $scope.isAuth = function() {
            //console.log("auth: " + $scope.match);
            if (!$scope.match) {
                $scope.openPage('notAuthorized')
            }
        };

        $scope.businessUiGrid = function() {

            if ($scope.match) {
                $scope.gridOptions = 'businessGridOptions';
            } else {
                $scope.gridOptions = 'unclaimedBusinessGridOptions';
            }

        };

        $scope.doNothing = function () {};


        $scope.checkRoles = function(Role, callback) {

            //console.log('in checkRoles function');

            var checkRole = Role;
            //console.log(checkRole);
            $scope.match = false;

            userCalls.getSignedInUser({}).then(
                function (res) {
                    //console.dir(res.data.user.roles);

                    res.data.user.roles.forEach(function (role) {
                        //console.log(checkRole);
                        //console.log(role);
                       // console.log(role === checkRole);
                        if(role === checkRole) {
                            $scope.match = true;
                            //console.log($scope.match);
                        }
                    });
                    callback();


                },
                function (err) {
                    console.error('Error getting users: ' + err.message);
                }
            );

            //console.log("Match : " + $scope.match)

        };

        ///// Business Owner FUNCTIONS ///////////////

        /* =====================================================================
         * Get all businessOwners from Mongo database
         * ===================================================================== */
        $scope.getBusinessOwners = function () {
            userCalls.getUsers({}).then(
                function (res) {

                    angular.copy(res.data).forEach(function (user) {
                        user.roles.forEach(function (role) {
                            if (role === "businessOwner") {
                                businessOwners.push(user);
                            }
                        })
                    });

                    $scope.businessOwners = businessOwners;
                    //console.dir(businessOwners);
                    $scope.businessOwnersGridOptions.data = businessOwners;
                },
                function (err) {
                    console.error('Error getting businessOwners: ' + err.message);
                }
            );
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

core.directive("importSheetJs", [SheetJSImportDirective]);

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

                    //console.dir(d);

                    d.forEach(function(element) {
                        //console.log(element);
                        $scope.createBusiness({newBusiness: element});
                    });
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    };
}