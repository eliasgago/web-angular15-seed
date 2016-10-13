import User from 'app/user/model/user.model';
import UserService from 'app/user/service/user.service';
import Role from 'app/role/model/role.model';
import RoleService from 'app/role/service/role.service';

interface IUserDetailController {
  user: User;
  roles: Array<Role>;
  selectedRoles: Array<Role>;

  save();
  toggleRole(role: Role);
  existRole(role: Role): boolean;
}

class UserDetailController implements IUserDetailController {

  user;
  roles;
  selectedRoles;

  isAddForm = true;
  isProcessing = false;
  error = null;

  static $inject = ['userService', 'roleService', '$translate', '$q', '$rootRouter'];

  constructor(
    private userService: UserService, 
    private roleService: RoleService, 
    private $translate: ng.translate.ITranslateService,
    private $q: ng.IQService, 
    private $rootRouter
  ) {}

  static factory(userService, roleService, $translate, $q, $rootRouter){
    return new UserDetailController(userService, roleService, $translate, $q, $rootRouter);
  }

  $routerOnActivate(next) {
    var deferred = this.$q.defer();

    var id = next.params.id;
    if(id){
      this.isAddForm = false;
      this.isProcessing = true;
      this.userService.get(id).then(
        user => {
          this.user = user;
          this.selectedRoles = user.roles;
          deferred.resolve(this.selectedRoles);
          this.isProcessing = false;
        },
        error => {
          this.$translate('GENERAL.ERROR_GET').then(function (translation) {
              this.error = translation;
          });
          deferred.reject(this.selectedRoles);
          this.isProcessing = false;
        }
      );
    }
    this.roleService.getAll().then(
      response => {
        this.roles = response.data;
      }
    );

  };

  save() {
    this.user.roles = this.selectedRoles;
    this.isProcessing = true;
    this.userService.save(this.user).then(
      user => {
        this.isProcessing = false;
        this.$rootRouter.navigate(['/Users']);
      },
      error => {
        console.log(error);
        this.$translate('GENERAL.ERROR_GUARDAR').then(
          translation => {
            this.error = translation;
          }
        );
        this.isProcessing = false;
      }
    );
  };

  toggleRole(role: Role) {
    if(!this.selectedRoles){
      this.selectedRoles = [];
    }
    var idx = this.indexOf(role, this.selectedRoles);
    if (idx > -1) {
      this.selectedRoles.splice(idx, 1);
    }
    else {
      this.selectedRoles.push(role);
    }
  };
  
  existRole(role: Role): boolean {
    var self = this;
    if(!this.selectedRoles){
      this.$q.resolve(this.selectedRoles);
    }else{
      if(this.indexOf(role, this.selectedRoles) != -1){
        return true;
      }
      return false;
    }
  };

  private indexOf(role: Role, list: Array<Role>){
    var i;
    for (i = list.length - 1; i >= 0; i--) {
      if(this.selectedRoles[i].name == role.name)
        return i;
    }
    return i;
  }

};

export default UserDetailController;