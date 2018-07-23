'use strict';
let grid = angular.module('grid',[
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
    'gm.typeaheadDropdown',
    'angular-clipboard',
    'ngRoute',
    'oc.lazyLoad',
    'ngToast'
]);
console.log('in gridModule');
grid.config([
    '$routeProvider',
    function (
        $routeProvider
    ) {
        $routeProvider
            .when('/grid',{
                name: 'home',
                templateUrl:'modules/grid/views/grid.client.view.html',
                label: 'home',
                controller: 'homeController',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'homeController',
                            files:[
                                // Controllers
                                'modules/grid/controllers/grid.client.controller.js',

                                // Styles
                                'modules/core/css/datagrids.client.styles.css'
                            ]});
                    }]
                }

            })
    }
]);