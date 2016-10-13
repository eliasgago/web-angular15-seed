import ApiService from 'app/services/api.service';

class RoleService {
   
  static $inject = ['apiService'];

  constructor(
    private apiService: ApiService
  ) {}

  itemType = 'role';
  links = [];
  
  getAll(query) {
    return this.apiService.getItems(this.itemType, query);
  };

  get(id) {
    return this.apiService.getItem(this.itemType, id, this.links);
  };

  save(item) {
    return this.apiService.saveItem(this.itemType, item);
  }

  remove(id) {
    return this.apiService.removeItem(this.itemType, id);
  }

}

export default RoleService;