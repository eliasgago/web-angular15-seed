
// Angular modules
import angular from 'angular';

// App modules
import AppComponent from './app.component';
import AppController from './app.controller';

// Config modules
import 'lib/config';

// REST access libraries
import 'angular-resource';
import 'angular-spring-data-rest';
import SpringDataRestConfig from './config/spring-data-rest.config';
import HTTPProviderConfig from './config/http-provider.config';

// i18n
import 'angular-cookies';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';
import TranslationConfig from './config/translation.config';

// Style
import './css/main.css!';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';
import 'angular-material/angular-material.css!';
import 'angular-material/layouts/angular-material.layouts.css!';
import 'angular-material/angular-material.css!';
import 'angular-messages';
import PalettesConfig from './config/palettes.config';

// Routing
import 'lib/angular_1_router.js';

// navbar & sidebars
import './navbar/navbar';

// Tables
import 'lib/md-data-table.js';
import './css/md-data-table.css!';

// Auth
import './auth/auth';

// App generic services
import UtilService from './services/util.service';
import ApiService from './services/api.service';

// App Modules
import './login/login';
import './user/user';
import './role/role';

export let app = angular.module('app', [
        'ngComponentRouter', // routing
        'ngResource', 'spring-data-rest', // services
        'ngCookies', 'pascalprecht.translate',  // translation
    	'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'md.data.table', // UI
    	'app.config', 'app.navbar', 'app.services.auth', 'app.login', 'app.users', 'app.roles' // application
    ])
    
    .value('$routerRootComponent', 'app')

    .config(['$translateProvider',
        ($translateProvider) =>
        {
            return new TranslationConfig($translateProvider);
        }
    ])

    .config(['SpringDataRestAdapterProvider',
        (SpringDataRestAdapterProvider) =>
        {
            return new SpringDataRestConfig(SpringDataRestAdapterProvider);
        }
    ])

    .config(['$mdThemingProvider',
        ($mdThemingProvider) =>
        {
            return new PalettesConfig($mdThemingProvider);
        }
    ])

    .config(['$httpProvider',
        ($httpProvider) =>
        {
            return new HTTPProviderConfig($httpProvider);
        }
    ])

    .config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            if(date){
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();

                return day + '/' + (monthIndex + 1) + '/' + year;
            }
            return '';
        };
    })

    .filter('booleanFilter', function() {
        return function(input) {
            if(input != null){
                return input ? 'GENERAL.SI' : 'GENERAL.NO';
            }
            return '';
        }
    })

    .service('utilService', UtilService)

    .service('apiService', ApiService)

    .component('app', new AppComponent())

    .controller('appController', AppController.factory);

angular.bootstrap(document, ['app'], {});