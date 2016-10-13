class AppController {

	static $inject = ['$mdSidenav', 'AuthService'];

	constructor(
		private $mdSidenav: ng.material.ISidenavService,
    private AuthService
	) {}

  static factory($mdSidenav, AuthService){
    return new AppController($mdSidenav, AuthService);
  }

}

export default AppController;