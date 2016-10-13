class TranslationConfig {

	static $inject = ['$translateProvider'];

  	constructor(
		private $translateProvider: ng.translate.ITranslateProvider
	){
	    this.$translateProvider.useStaticFilesLoader({
	        prefix: './app/i18n/locale-',
	        suffix: '.json'
	    });
	    //$translateProvider.preferredLanguage('es');
	    this.$translateProvider.determinePreferredLanguage();
	    this.$translateProvider.useLocalStorage();
	}

}

export default TranslationConfig;