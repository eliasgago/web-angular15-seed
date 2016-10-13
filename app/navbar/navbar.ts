import NavbarComponent from 'app/navbar/navbar.component';
import NavbarController from 'app/navbar/navbar.controller';

angular.module('app.navbar', [])
	.component('navBar', new NavbarComponent())

	.controller('navbarController', NavbarController.factory);