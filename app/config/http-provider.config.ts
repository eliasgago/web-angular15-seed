class HTTPProviderConfig {

    static $inject = ['$httpProvider'];

    constructor(
        private $httpProvider: ng.IHttpProvider
    ) {
        
        $httpProvider.interceptors.push(function($q, $injector, $cookies) {

            var AuthService, rootRouter;

            return {
                request: function(request) {
                    if ($cookies.get('app_token')){
                        request.headers['Authorization'] =  'Bearer ' + $cookies.get('app_token');
                    }
                    return request;
                },
                responseError: function(rejection) {

                    if (!AuthService) { AuthService = $injector.get('AuthService'); }
                    if (!rootRouter) { rootRouter = $injector.get('$rootRouter'); }

                    var url = rejection.config.url;
                    var isRefreshUrl = url.indexOf('auth_refresh') != -1;

                    if (rejection.status === 401) {
                        if(isRefreshUrl){
                            rootRouter.navigate(['/Login']);
                        }else{
                            console.log("unauthorized");
                            console.log("calling refresh token");
                            return AuthService.refresh().then(
                                response => {
                                    rejection.config.headers.Authorization = 'Bearer ' + $cookies.get('app_token');
                                    console.log(rejection.config);
                                    return $injector.get('$http')(rejection.config);
                                }
                            );
                        }
                    }
                    if (rejection.status === -1){
                        rejection.statusText = 'GENERAL.CONNECTION_ERROR';
                    }

                    return $q.reject(rejection);
                }
            };
        });
    }
}

export default HTTPProviderConfig; 