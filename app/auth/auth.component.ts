class AuthComponent implements ng.IComponentOptions {

	$canActivate = ['AuthService', '$rootRouter', function(AuthService, $rootRouter) {
		if (AuthService.isLogged()) {
			return true;
		} else {
			$rootRouter.navigate(['/Login']);
			return false;
		}
	}];
}

export default AuthComponent;