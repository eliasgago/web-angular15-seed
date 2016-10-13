import ApiService from 'app/services/api.service';
import UtilService from 'app/services/util.service';

class UserService {
   
  static $inject = ['apiService', 'utilService', '$q', '$http', 'SpringDataRestAdapter', 'appAuthUrl'];

  constructor(
    private apiService: ApiService, 
    private utilService: UtilService,
    private $q: ng.IQService,
    private $http: ng.IHttpService,
    private SpringDataRestAdapter: any,
    private appAuthUrl: string
  ) {}

  itemType = 'user';
  links = [];
  
  getAll(queryParams) {
    var self = this;

    var url = this.appAuthUrl + '/users';
    if(queryParams){
      url = url + '?';
      if(queryParams.size){
        url = url + 'size=' + queryParams.size + '&';
      }
      if(queryParams.page){
        url = url + 'page=' + (queryParams.page -1) + '&';
      }
      if(queryParams.order){
        if(queryParams.order.startsWith('-')){
          console.log('menos');
          var order = queryParams.order.substring(1, queryParams.order.length);
          url = url + 'sort=' + order + '&' + order + '.dir=asc';
        }else{
          url = url + 'sort=' + queryParams.order + '&';
        }
      }
    }

    var httpPromise = this.$http.get(url);
 
    return this.SpringDataRestAdapter.process(httpPromise).then(
      function(processedResponse) {
        processedResponse._embeddedItems.forEach(function(item){
          item.id = self.utilService.getId(item);
          item.href = self.utilService.getHref(item);
        });
        var response = {
          data: processedResponse._embeddedItems,
          totalElements: processedResponse.page.totalElements,
          totalPages: processedResponse.page.totalPages
        }
        console.log(processedResponse);
        
        var availableResources = processedResponse._resources();
        console.log(availableResources);

        return response;
      }
    );
  };

  get(id) {
    return this.apiService.getItem(this.itemType, id, this.links);
  };

  save(item) {
    /*if(item.newPassword && item.newPassword != ''){
      item.password = item.newPassword;
    }
    delete item.newPassword;*/
    if(!item.id){
      item.active = true;
      item.password = item.newPassword;
    }
    console.log(item);
    return this.apiService.saveItem(this.itemType, item, this.links);
  }

  removeAll(items) {
    var promises = [];
    for (var i = items.length - 1; i >= 0; i--) {
      promises.push(this.apiService.removeItem(this.itemType, items[i]));
    }
    return this.$q.all(promises);
  }

  getByIdentifier(identifier){
    var self = this;
    var httpPromise = this.$http.get(this.appAuthUrl + '/users/search/byIdentifier?identifier=' + identifier);

    return this.SpringDataRestAdapter.process(httpPromise, 'roles').then(
      function(processedResponse) {
        processedResponse['roles'] = processedResponse['roles']._embeddedItems;
        processedResponse['roles'].forEach(function(subItem){
          subItem.id = self.utilService.getId(subItem);
          subItem.href = self.utilService.getHref(subItem);
        });
        return processedResponse;
      }
    );

  }


}

export default UserService;