class AppComponent implements ng.IComponentOptions {
    controller = 'appController';
    templateUrl = 'app/app.html';
    controllerAs = 'vm';

    $routeConfig = [
        { path: '/users/...', name: 'Users', component: 'users', useAsDefault: true },
        { path: '/login/', name: 'Login', component: 'login'}
    ]
};

export default AppComponent;