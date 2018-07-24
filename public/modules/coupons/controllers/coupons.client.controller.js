'use strict';
var coupons = angular.module('coupons',[
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

coupons.controller('couponsController',[
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
    'methodCop',
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
        methodCop,
        uiGridConstants,
        $filter
    ) {

        $scope.appheader = 'coupons';

        var coupons = "",
            newCoupon = '';


        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'coupon',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label:'Type', field: 'Type', required: true},
                { label:'Address 1', field: 'Address1', required: false},
                { label:'Address 2', field: 'Address2', required: false},
                { label:'City', field: 'City', required: false},
                { label:'State / Province', field: 'StateProvince', required: false},
                { label:'Postal Code', field: 'PostalCode', required: false},
                { label:'Country', field: 'Country', required: false},
                { label:'Phone', field: 'Phone', required: false},
                { label:'Email', field: 'Email', required: false},
                { label:'Responsible Employee', field: 'ResponsibleEmployee', required: false}
            ]
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'Update',
            collectionName: 'coupon',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label:'Type', field: 'Type', required: true},
                { label:'Address 1', field: 'Address1', required: false},
                { label:'Address 2', field: 'Address2', required: false},
                { label:'City', field: 'City', required: false},
                { label:'State / Province', field: 'StateProvince', required: false},
                { label:'Postal Code', field: 'PostalCode', required: false},
                { label:'Country', field: 'Country', required: false},
                { label:'Phone', field: 'Phone', required: false},
                { label:'Email', field: 'Email', required: false},
                { label:'Responsible Employee', field: 'ResponsibleEmployee', required: false}
            ]
        };

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
            couponCalls.newCoupon({
                email: newCoupon.email,
                password: newCoupon.password
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
