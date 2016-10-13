import AuthComponent from 'app/auth/auth.component';

export default class UserComponent extends AuthComponent {

    templateUrl = 'app/user/user.html';

	$routeConfig = [
		{ path: '/', name: 'UserList', component: 'userList', useAsDefault: true },
		{ path: '/new', name: 'UserAdd', component: 'userDetail' },
		{ path: '/:id', name: 'UserDetail', component: 'userDetail' }
	];

}