import UtilService from 'app/services/util.service';

class ApiService {

  static $inject = ['utilService', 'appAuthUrl', 'appDataUrl', '$http', '$q', 'SpringDataRestAdapter'];

  constructor(
    private utilService: UtilService, 
    private appAuthUrl: string, 
    private appDataUrl: string, 
    private $http: ng.IHttpService, 
    private $q: ng.IQService, 
    private SpringDataRestAdapter: any
  ) {}

  private apiUrl = {
    user: this.appAuthUrl + '/users',
    role: this.appAuthUrl + '/roles',
    process: this.appDataUrl + '/domain/process',
    status: this.appDataUrl + '/domain/status',
    signatureType: this.appDataUrl + '/domain/signatureTypes'
  }

  getItems(itemType, queryParams, filterParams = null) {
    var url = this.apiUrl[itemType];
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
          var order = queryParams.order.substring(1, queryParams.order.length);
          url = url + 'sort=' + order + '&' + order + '.dir=asc';
        }else{
          url = url + 'sort=' + queryParams.order + '&';
        }
      }
    }

    var httpPromise = this.$http.get(url);
 
    return this.SpringDataRestAdapter.process(httpPromise).then(
      processedResponse => {
        processedResponse._embeddedItems.forEach( item => {
          item.id = this.utilService.getId(item);
          item.href = this.utilService.getHref(item);
        });
        var response = {
          data: processedResponse._embeddedItems,
          totalElements: processedResponse.page.totalElements,
          totalPages: processedResponse.page.totalPages
        }
        return response;
      }
    );
  };

  getItem(itemType, id, links = null) {
    var httpPromise = this.$http.get(this.apiUrl[itemType] + "/" + id);

    return this.SpringDataRestAdapter.process(httpPromise, links).then(
      processedResponse => {
        processedResponse.id = this.utilService.getId(processedResponse);
        processedResponse.href = this.utilService.getHref(processedResponse);

        if(links){
          links.forEach( relationship => {
            if(processedResponse[relationship]){
              if(processedResponse[relationship]._embeddedItems){
                processedResponse[relationship] = processedResponse[relationship]._embeddedItems;
                processedResponse[relationship].forEach( subItem => {
                  subItem.id = this.utilService.getId(subItem);
                  subItem.href = this.utilService.getHref(subItem);
                });
              }else{
                processedResponse[relationship] = processedResponse[relationship];
                processedResponse[relationship].id = this.utilService.getId(processedResponse[relationship]);
                processedResponse[relationship].href = this.utilService.getHref(processedResponse[relationship]);
              }
            }
          });
        }
        return processedResponse;
      }
    );
  }

  saveItem(itemType, item, links = null) {
    item = this.utilService.getHrefEntity(item);

    for (var i = links.length - 1; i >= 0; i--) {
      var itemRelationship = item[links[i]];
      if(itemRelationship){
        console.log(itemRelationship);
        for (var j = itemRelationship.length - 1; j >= 0; j--) {
          itemRelationship[j] = itemRelationship[j].href;
        }
      }
    };

    console.log(item);
    if(item.href){
      return this.editItem(itemType, item);
    }else{
      return this.addItem(itemType, item);
    }
  }

  removeItem(itemType, item) {
    var defered = this.$q.defer();
    var promise = defered.promise;
    if(item.active)
      item.active = false;

    return this.editItem(itemType, item);;
  }

  private addItem(itemType, item) {
    var defered = this.$q.defer();
    var promise = defered.promise;

    this.$http.post(this.apiUrl[itemType], item)
      .success( data => {
        defered.resolve(data);
      })
      .error( err => {
        defered.reject(err);
      });

    return promise;
  }

  private editItem(itemType, item) {
    var defered = this.$q.defer();
    var promise = defered.promise;
    item = this.utilService.getHrefEntity(item);

    this.$http.put(this.apiUrl[itemType] + "/" + item.id, item)
      .success( data => {
        defered.resolve(data);
      })
      .error( err => {
        defered.reject(err);
      });

    return promise;
  }

}

export default ApiService;