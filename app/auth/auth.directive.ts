import AuthService from 'app/auth/auth.service';

class AuthDirective implements ng.IDirective {

	public restrict = 'A';
    public priority = 100000;
    public scope = false;

    loggedUserData;
    loggedUserPromise;

    constructor(
        private AuthService: AuthService,
        private $q: ng.IQService
    ){}

    loadData(){ 

         if(this.loggedUserPromise) {
           return this.loggedUserPromise;
         }

         var deferred = this.$q.defer();
         this.loggedUserPromise = deferred.promise;

         if(this.loggedUserData) {
            deferred.resolve(this.loggedUserData);
         }else{   
             this.AuthService.getUser().then(
                user => {
                    this.loggedUserData = user;
                    deferred.resolve(this.loggedUserData);
                },
                error => {
                    deferred.reject('Failed to load data');
                }
            ); 
        }
        return this.loggedUserPromise;
    }

    link(scope, element, attr){
        var roles = attr.access.split(" ");
        element.hide();
        if(this.loggedUserData != null && this.loggedUserData.identifier != this.AuthService.getUserIdentifier()){
            this.loggedUserData = null;
            this.loggedUserPromise = null;
        }

        this.loadData().then(
            user => {
                var result = false;
                for (var i = roles.length - 1; i >= 0; i--) {
                    for (var j = user.roles.length - 1; j >= 0; j--) {
                        if(roles[i] == user.roles[j].authority)
                            result = true;
                    }
                }
                if(!result){
                    element.remove();   
                }else{
                    element.show();
                }
            },
            error => {
                element.remove();  
            }
        );
    }

}

export default AuthDirective;