import AuthService from 'app/auth/auth.service';

class LoginController {

	username: string;
	password: string;

	processing = false;
	error = null;

	static $inject = ['AuthService', '$translate'];

  	constructor(
  		private AuthService: AuthService, 
    	private $translate: ng.translate.ITranslateService
  	) {}

	static factory(AuthService, $translate){
	    return new LoginController(AuthService, $translate);
  	}

    login() {
		this.processing = true;
		this.error = null;
		var prom = this.AuthService.auth(this.username, this.password).then(
			success => {
				console.log(success);
				console.log('logged');
				this.processing = false;
			},
			error => {
				console.log(error);
				this.$translate(error.statusText).then(
					translation => {
			    		this.error = translation;
			  		}
			  	);
				this.processing = false;
			}
		);
	}

}

export default LoginController;