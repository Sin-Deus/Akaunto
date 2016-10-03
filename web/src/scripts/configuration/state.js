/**
 * Configuration for the router.
 * @param {object} $stateProvider
 * @param {object} $urlRouterProvider
 */
function stateConfiguration($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('home');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '/views/login.html',
            controller: 'LoginController as loginController'
        })
        .state('user', {
            url: '/user',
            templateUrl: '/views/user.html',
            controller: 'UserController as userController',
            resolve: {
                userResolve: ['userService', function (userService) {
                    return userService.getMe();
                }]
            }
        })
        .state('home', {
            url: '/home',
            template: '<h1>Home</h1><div>{{user|json}}</div>',
            controller: ['$scope', 'userService', function ($scope, userService) {
                userService.getMe().then(me => $scope.user = me);
            }]
        });
}

stateConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];

export default stateConfiguration;
