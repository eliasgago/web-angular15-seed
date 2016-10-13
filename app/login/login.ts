import LoginComponent from 'app/login/login.component';
import LoginController from 'app/login/login.controller';

angular.module('app.login', ['app.services.auth'])
	.component('login', new LoginComponent())

	.controller('loginController', LoginController.factory);
