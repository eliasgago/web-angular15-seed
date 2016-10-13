class PalettesConfig {

	static $inject = ['$mdThemingProvider'];

  	constructor(
		private $mdThemingProvider
	){
	    var customPrimary = {
	        '50': '#1898ff',
	        '100': '#008cfe',
	        '200': '#007ee4',
	        '300': '#0070cb',
	        '400': '#0062b1',
	        '500': '#005498',
	        '600': '#00467e',
	        '700': '#003865',
	        '800': '#002a4b',
	        '900': '#001c32',
	        'A100': '#32a3ff',
	        'A200': '#4bafff',
	        'A400': '#65baff',
	        'A700': '#000e18',
	        'contrastDefaultColor': 'light'
	    };
	    this.$mdThemingProvider
	        .definePalette('customPrimary', 
	                        customPrimary);

	    var customAccent = {
	        '50': '#802711',
	        '100': '#962e14',
	        '200': '#ad3517',
	        '300': '#c33c1a',
	        '400': '#da421d',
	        '500': '#e3512e',
	        '600': '#e9775a',
	        '700': '#ec8971',
	        '800': '#ef9c87',
	        '900': '#f2af9e',
	        'A100': '#e9775a',
	        'A200': '#E66444',
	        'A400': '#e3512e',
	        'A700': '#f5c1b4',
	        'contrastDefaultColor': 'light'
	    };
	    this.$mdThemingProvider
	        .definePalette('customAccent', 
	                        customAccent);

	    var customWarn = {
	        '50': '#ffb280',
	        '100': '#ffa266',
	        '200': '#ff934d',
	        '300': '#ff8333',
	        '400': '#ff741a',
	        '500': '#ff6400',
	        '600': '#e65a00',
	        '700': '#cc5000',
	        '800': '#b34600',
	        '900': '#993c00',
	        'A100': '#ffc199',
	        'A200': '#ffd1b3',
	        'A400': '#ffe0cc',
	        'A700': '#803200'
	    };
	    this.$mdThemingProvider
	        .definePalette('customWarn', 
	                        customWarn);

	    var customBackground = {
	        '50': '#ffffff',
	        '100': '#ffffff',
	        '200': '#ffffff',
	        '300': '#ffffff',
	        '400': '#ffffff',
	        '500': '#fff',
	        '600': '#f2f2f2',
	        '700': '#e6e6e6',
	        '800': '#d9d9d9',
	        '900': '#cccccc',
	        'A100': '#ffffff',
	        'A200': '#ffffff',
	        'A400': '#ffffff',
	        'A700': '#bfbfbf'
	    };
	    this.$mdThemingProvider
	        .definePalette('customBackground', 
	                        customBackground);

	   	this.$mdThemingProvider.theme('default')
	       .primaryPalette('customPrimary')
	       .accentPalette('customAccent')
	       .warnPalette('customWarn')
	       .backgroundPalette('customBackground')

	}

}

export default PalettesConfig;