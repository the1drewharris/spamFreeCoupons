'use strict';
let home = angular.module('home',[
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

home.controller('homeController',[
    '$scope',
    function (
        $scope
    ) {

        console.log('in grid.client.controller');

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
                { name:'Name', field:'name', width: 270},
                { name:'Address', field: 'address'},
                { name:'City', field: 'city', },
                { name:'State', field: 'state'},
                { name:'Zip Code', field: 'zipCode'},
                { name:'Balance', field: 'balance', cellFilter: 'currency'},
            ],
            data : []
        };

        $scope.grid = function () {
            $scope.gridOptions.data = [
                {
                    name: 'Zach',
                    address: '12907 S. 120th E. Pl.',
                    city: 'Broken Arrow',
                    state: 'OK',
                    zipCode: 74011,
                    balance: 420
                }
            ]
        };

    }
]);
