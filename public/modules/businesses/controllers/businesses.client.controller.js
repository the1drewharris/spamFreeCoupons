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
        businessesCalls,
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

        $scope.appheader = 'business';

        var businesses = "",
            newbusiness = '',
            employees = "",
            businessTask = "";


        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'business',
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
            collectionName: 'business',
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
                    '<md-button aria-label="business Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
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

            var id = $routeParams.testId;
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
                            businessOwnerId: $scope.signedInBusinessOwner.id
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
                    console.log('Congrats it worked! hopefully. . .')
                    //$scope.openPage('business/view/' + id);
                }
            ]);

        };
        $scope.editBusiness = function (newBusiness) {

            businessesCalls.updateBusiness({
                id: newBusiness.id,
                name: newBusiness.name,
                Address1: newBusiness.Address1,

                City: newBusiness.City,
                state: newBusiness.state,
                PostalCode: newBusiness.PostalCode,
                Phone: newBusiness.Phone

            }).then(
                function (res) {
                    updatedBusiness = angular.copy(res.data);
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
                email: newBusiness.email,
                password: newBusiness.password
            }).then(
                function (res) {
                    newBusiness = angular.copy(res.data);
                },
                function (err) {
                    $scope.badBusiness = 'Error creating business: ' + JSON.stringify(err.data.message);
                    console.error('Error creating business: ' + JSON.stringify(err.data.message));
                }
            );
        };

    }
]);
