class UtilService {

  constructor() {}

  getHrefEntity(entity) {
      var newEntity = { href: ''};
      if(entity.href){
        newEntity.href = entity.href;
      }
      for (var property in entity) {
          if (property != 'href' && entity.hasOwnProperty(property)) {
              newEntity[property] = entity[property]
          }
      }
      return newEntity;
  };

  getHref(data: string){
    return this.getUrlHref(data);
  }

  getDataUrl(data: string, rel: string){
    return this.getUrlRel(data, rel);
  }

  getId(data: string){
    var href = this.getUrlHref(data);
    return href.split("/").pop();
  }

  getIdFromUrl(url: string){
    return url.split("/").pop();
  }

  private getUrlRel(data, rel){
    return data._links[rel].href;
  }

  private getUrlHref(data){
    return data._links.self.href;
  }

  private getUrl(data, rel) {
    var href;
    if(data.links){
      data.links.forEach(function(link) {
        if (link.rel == rel) {
          href = link.href;
        }
      });
    }
    return href;
  }

}

export default UtilService;