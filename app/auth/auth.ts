import AuthService from 'app/auth/auth.service';
import AuthDirective from 'app/auth/auth.directive';

angular.module('app.services.auth', [])
	.service('AuthService', AuthService)

	.directive('restrict', ['AuthService','$q',
        (AuthService, $q) =>
        {
            return new AuthDirective(AuthService, $q);
        }
    ]);