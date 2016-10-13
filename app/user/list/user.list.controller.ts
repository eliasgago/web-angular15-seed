import UserService from 'app/user/service/user.service';
import User from 'app/user/model/user.model';

interface IUserListController {

  users: Array<User>;
  total: number;

}

class UserListController implements IUserListController {

  users;
  total;

  promise;
  selected = [];
  query = {
    order: 'identifier',
    limit: 5,
    page: 1
  };

  isProcessing = true;
  error = null;

  static $inject = ['userService','$translate'];

  constructor(
    public userService: UserService, 
    private $translate: ng.translate.ITranslateService
  ) {}

  static factory(userService, $translate){
    return new UserListController(userService, $translate);
  }

  $routerOnActivate(next) {
    this.getUsers(this, 1, 5, null);
  }

  getUsers(context, page, limit, order) {
    context.error = null;
    if(page){
      context.query.page = page;
    }
    if(limit){
      context.query.limit = limit;
    }
    if(order){
      context.query.order = order;
    }
    var queryParams = {
      size: context.query.limit,
      page: context.query.page,
      order: context.query.order,
    }

    context.promise = context.userService.getAll(queryParams).then(
      response => {
        context.users = response.data;
        context.total = response.totalElements;
        context.isProcessing = false;
      },
      error => {
        context.$translate('GENERAL.ERROR_GET').then(
          translation => {
            context.error = translation;
          }
        );
        context.isProcessing = false;
      }
    );
  }

  getUsersOrdered(context, order){
    context.getUsers(context, context.query.page, context.query.limit, order);
  }

  deleteUsers() {
    this.userService.removeAll(this.selected).then(
      () => {
        this.selected = [];
      },
      () => {
        this.selected = [];
        console.log('error borrando elementos');
      }
    );
  }

}

export default UserListController;