import UserService from 'app/user/service/user.service';
import User from 'app/user/model/user.model';
import Role from 'app/role/model/role.model';

class AuthService {

	static $inject = ['$q', '$http', '$httpParamSerializer', '$cookies', '$rootRouter', 'appAuthUrl', 'appAuthData', 'userService'];

  	constructor(
  		private $q: ng.IQService, 
  		private $http: ng.IHttpService, 
  		private $httpParamSerializer: any, 
  		private $cookies: ng.cookies.ICookiesService, 
  		private $rootRouter: any, 
  		private appAuthUrl: string,
  		private appAuthData,
  		private userService: UserService
  	) {}

  	loggedIn: boolean;
  	user: User;

	auth(username, password) {
	    var data = {
	    	username: username, 
	    	password: password, 
	    	client_id: this.appAuthData.client_id,
	    	client_secret: this.appAuthData.client_secret,
	    	grant_type: this.appAuthData.grant_type,
	    	scope: this.appAuthData.scope
	    };
	    username = data.username;

	    var encoded = btoa("hum4n012345");

	    var req = {
	        method: 'POST',
	        url: this.appAuthUrl + '/oauth/token',
	        headers: {
	            "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
	        },
	        data: this.$httpParamSerializer(data)
	    }
	    
		return this.$http(req).then(
			response => {
				var today = new Date();
				var expired = new Date();
				expired.setDate(today.getDate() + 1);
				this.$cookies.put('app_token', response.data.access_token, { expires: expired });
				this.$cookies.put('app_refresh_token', response.data.refresh_token, { expires: expired });
				this.$cookies.put('app_user', username, { expires: expired });
				this.$rootRouter.navigate(['/Users']);
				return response.data.access_token;
			}, 
			error => {
				if(error.data && error.data.error == 'invalid_grant'){
					error.statusText = 'LOGIN.ERROR_AUTENTICACION';
				}else{
					error.statusText = 'GENERAL.CONNECTION_ERROR';
				}
				return this.$q.reject(error);
			}
		);
	}

	refresh() {

		var refresh_token = this.$cookies.get('app_refresh_token')

	    var data = {
	    	refresh_token: refresh_token,
	    	client_id: "human",
	    	client_secret: "hum4n012345",
	    	grant_type: "refresh_token",
	    	scope: "read write"
	    };

	    var encoded = btoa("hum4n012345");

	    var req = {
	        method: 'POST',
	        url: this.appAuthUrl + '/oauth/token',
	        headers: {
	            "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
	        },
	        data: this.$httpParamSerializer(data)
	    }
	    
	    console.log(data);

		return this.$http(req).then(

			response => {
				var today = new Date();
				var expired = new Date();
				expired.setDate(today.getDate() + 1);
				this.$cookies.put('app_token', response.data.access_token, { expires: expired });
				this.$cookies.put('app_refresh_token', response.data.refresh_token, { expires: expired });
				this.loggedIn = true;

				console.log(response.data);
				console.log('Refresh OK');
				return response.data.access_token;
			},
			error => {
				if(error.data && error.data.error == 'invalid_grant'){
					error.statusText = 'LOGIN.ERROR_AUTENTICACION';
				}else{
					error.statusText = 'GENERAL.CONNECTION_ERROR';
				}
				return this.$q.reject(error);
			});

	}

	isLogged() {
		if (this.$cookies.get('app_token')) {
			return true;
		}
		return false;
	}

	logout() {
		this.$cookies.remove('app_token');
		this.$cookies.remove('app_refresh_token');
		this.$cookies.remove('app_user');
		this.loggedIn = false;
		this.user = null;
	}

	getUserIdentifier(){
		return this.$cookies.get('app_user');
	}

 	getUser(){
		if(this.user){
			return this.$q.resolve(this.user);
		}else{
			var username = this.$cookies.get('app_user');
			if(username){
				return this.userService.getByIdentifier(username).then(
					user => {
						this.user = user;
						return this.user;
					}
				);
			}else{
				return this.$q.reject();
			}
		}
	}
}

export default AuthService;