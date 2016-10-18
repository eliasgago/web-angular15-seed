class SpringDataRestConfig {
	
	static $inject = ['SpringDataRestAdapterProvider'];

  	constructor(
  		private SpringDataRestAdapterProvider: any
  	){
	    SpringDataRestAdapterProvider.config({
	        'linksKey': '_links'
	    });
	}

}

export default SpringDataRestConfig;