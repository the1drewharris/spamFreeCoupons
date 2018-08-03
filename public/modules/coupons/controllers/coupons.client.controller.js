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
        $scope.category = ['Food','Beauty','Health','Automotive','Home Improvement','Entertainment','Legal'];

        var coupons = "",
            newCoupon = '';

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                    '<md-button aria-label="coupon Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
                    + '<i class="glyphicon glyphicon-pencil"></i>'
                    + '<md-tooltip>{{row.entity.Name}} Detail</md-tooltip>'
                    + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 50,
                    height: 30,
                    pinnable: false
                },
                { name:'Name', field: 'Name'},
                { name: 'Type', field: 'Type'},
                { name:'Address', field: 'Address1'},
                { name:'Phone', field: 'Phone'},
                { name: 'Email', field: 'Email'}
            ],
            data : []
        };

        $scope.openPage = function (pageName) {
            $location.path(pageName.replace(/#/, ''));
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

        $scope.loadCategories = function () {
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
                cat.lowername = veg.name.toLowerCase();
                return cat;
            });
        };

        $scope.transformChip = function (chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { name: chip, type: 'new' };
        };

        $scope.querySearch = function (query) {
            var results = query ? $scope.category.filter($scope.createFilterFor(query)) : [];
            return results;
        };

        $scope.createFilterFor = function (query) {
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(category) {
                return (category.indexOf(lowercaseQuery) === 0);
            };

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
                    $scope.badCoupon = 'Error creating coupon: ' + JSON.stringify(err.data.message);
                    console.error('Error creating coupon: ' + JSON.stringify(err.data.message));
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
        $scope.getCoupons = function () {

            couponCalls.getCoupons({}).then(
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
            var category = [];
            couponCalls.newCoupon({
                title: newCoupon.title,
                description: newCoupon.description,
                couponCode: newCoupon.couponCode,
                category: category,
                status: newCoupon.status,
                repeatFrequency: $scope.selected,
                businessId: id
            }).then(
                function (res) {
                    newCoupon = angular.copy(res.data);
                },
                function (err) {
                    $scope.badCoupon = 'Error creating coupon: ' + JSON.stringify(err.data.message);
                    console.error('Error creating coupon: ' + JSON.stringify(err.data.message));
                }
            );
        };

    }
]);
