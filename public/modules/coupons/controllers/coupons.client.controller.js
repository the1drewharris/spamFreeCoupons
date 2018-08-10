'use strict';
var coupon = angular.module('coupon',[
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

coupon.controller('couponsController',[
    'couponCalls',
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
    function (
        couponCalls,
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
        $filter
    ) {

        $scope.appheader = 'coupons';

        $scope.items = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        $scope.selected = [];
        $scope.categories = [];


        var coupons = "",
            newBusiness = '';

        var self = this;

        self.categories = loadCategories();
        self.selectedCategories = [];

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
                { name:'Title', field: 'title'},
                { name: 'Description', field: 'description'},
                { name:'Categories', field: 'category'},
                {
                    name:'Status',
                    field: 'status',
                    cellTemplate:
                        '<md-switch ng-model="row.entity.status" aria-label="Status" ng-true-value="\'active\'" ng-false-value="\'inactive\'">',
                    width: 60
                },
                { name: 'Repeat Frequency', field: 'repeatFrequency'},
                { name:'Coupon Code', field: 'couponCode'},
                {
                    name: 'Edit',
                    cellTemplate:
                        '<div class="fa-pencil">' +
                        '   <md-button class="btn-default" ng-click="grid.appScope.openPage(\'coupon/update/\' + row.entity.id)"></md-button>' +
                        '</div>',
                    width: 40
                }
            ],
            rowHeight: 45,
            data : []
        };

        $scope.openPage = function (pageName) {
            $location.path(pageName.replace(/#/, ''));
        };

        $scope.showBusiness = function () {
            var id = $routeParams.id;
            $scope.openPage('business/view/' + id)
        };

        $scope.isAuth = function () {
            couponCalls.isAuth().then(
                function (res) {
                    console.dir('isAuth data: ' + res.data);
                    $scope.auth = res.data;
                },
                function (err) {
                    console.error('Error : ' + JSON.stringify(err.data.message));
                }
            )
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

            console.dir($scope.selectedCategories);
            console.dir(self.selectedCategories);
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

        $scope.getCoupon = function () {
            var couponId = $routeParams.couponId;
            console.log(couponId);

            couponCalls.searchCoupons({
                id: couponId
            }).then(
                function (res) {
                    coupon = angular.copy(res.data);
                    $scope.coupon = coupon[0];
                    //$scope.selectedCategories = $scope.coupon.category;
                    console.dir($scope.coupon);
                },
                function (err) {
                    $scope.badCoupon = 'Error getting coupon: ' + JSON.stringify(err.data.message);
                    console.error('Error getting coupon: ' + JSON.stringify(err.data.message));
                }
            );
        };

        $scope.getCoupons = function (couponId) {
            couponCalls.searchCoupons({
                couponId: couponId

            }).then(
                function (res) {
                    coupons = angular.copy(res.data);
                    $scope.coupons = coupons;
                    $scope.gridOptions.data = res.data
                },
                function (err) {
                    $scope.badCoupon = 'Error getting coupon: ' + JSON.stringify(err.data.message);
                    console.error('Error getting coupon: ' + JSON.stringify(err.data.message));
                }
            );
        };

        $scope.refreshData = function (keyword) {
            $scope.gridOptions.data = $scope.coupons;
            while (keyword) {
                var oSearchArray = keyword.split(' ');
                $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, oSearchArray[0], undefined);
                oSearchArray.shift();
                keyword = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
            }
        };

        /* =====================================================================
         * Get all coupons from Mongo database
         * ===================================================================== */
        $scope.getBusinessCoupons = function () {
            var id = $routeParams.id;
            couponCalls.searchCoupons({
                businessId: id
            }).then(
                function (res) {
                    coupons = angular.copy(res.data);
                    $scope.coupons = coupons;
                    console.dir(coupons);
                    $scope.gridOptions.data = coupons;
                },
                function (err) {
                    console.error('Error getting coupons: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * create new coupon
         * ===================================================================== */
        $scope.createCoupon = function (newCoupon) {
            var id = $routeParams.id;


            async.series([

                function(callback) {

                    couponCalls.getBusiness({
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

                    console.dir($scope.selectedCategories);
                    $scope.selectedCategories.forEach(function (item) {
                        $scope.categories.push(item.name);
                        console.dir(item)
                    });
                    console.dir($scope.categories);
                    console.dir($scope.selectedCategories);
                    console.dir(newCoupon);

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

                    couponCalls.updateBusiness({
                        id: id,
                        coupons: $scope.business[0].coupons
                    }).then(
                        function (res) {
                            newBusiness = angular.copy(res.data);
                            $scope.openPage('business/view/' + id);
                        },
                        function (err) {
                            $scope.badBusiness = 'Error updating Business: ' + JSON.stringify(err.data.message);
                            console.error('Error updating Business: ' + JSON.stringify(err.data.message));
                        }
                    )

                }
            ]);



        };


    }
]);
