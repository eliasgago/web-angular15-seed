import AuthService from 'app/auth/auth.service';

class NavbarController {

	static $inject = ['AuthService'];

  	constructor(
  		private AuthService: AuthService
  	) {}

    static factory(AuthService){
      return new NavbarController(AuthService);
    }

}

export default NavbarController;