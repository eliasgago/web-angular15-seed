import UserService from 'app/user/service/user.service';
import UserComponent from 'app/user/user.component';
import UserListComponent from 'app/user/list/user.list.component';
import UserListController from 'app/user/list/user.list.controller';
import UserDetailComponent from 'app/user/detail/user.detail.component';
import UserDetailController from 'app/user/detail/user.detail.controller';

angular.module('app.users', [])
  .service('userService', UserService)

  .component('users', new UserComponent())

  .component('userList', new UserListComponent())

  .controller('userListController', UserListController.factory)

  .component('userDetail', new UserDetailComponent())

  .controller('userDetailController', UserDetailController.factory);
