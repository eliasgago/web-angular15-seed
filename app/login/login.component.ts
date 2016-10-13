class LoginComponent implements ng.IComponentOptions {

	templateUrl = 'app/login/login.html';
	controller = 'loginController';
	controllerAs = 'vm';

	$canActivate = ['AuthService', function(AuthService) {
		console.log('canActivate');
		AuthService.logout();
		return true;
	}];

}

export default LoginComponent;