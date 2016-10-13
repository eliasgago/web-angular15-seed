import AuthService from 'app/auth/auth.service';

class NavbarController {

	static $inject = ['AuthService', '$mdSidenav'];

  	constructor(
  		private AuthService: AuthService, 
  		private $mdSidenav: ng.material.ISidenavService
  	) {}

    static factory(AuthService, $mdSidenav){
      return new NavbarController(AuthService, $mdSidenav);
    }

    /*vm.logout = function() {
      vm.Auth.logout();
      $rootRouter.navigate(['/Login']);
    }*/

    openLeftMenu() {
       this.$mdSidenav('left').toggle();
    }
    
}

export default NavbarController;