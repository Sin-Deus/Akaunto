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
            templateUrl: '/views/home.html',
            controller: 'HomeController as homeController',
            resolve: {
                userResolve: ['userService', function (userService) {
                    return userService.getMe();
                }],
                accountsResolve: ['accountService', function (accountService) {
                    return accountService.getAccounts();
                }]
            }
        })
        .state('accountForm', {
            url: '/account-form/:accountId',
            templateUrl: '/views/account-form.html',
            controller: 'AccountFormController as accountFormController',
            resolve: {
                accountResolve: ['accountService', '$stateParams', function (accountService, $stateParams) {
                    return $stateParams.accountId ? accountService.getAccount($stateParams.accountId) : {};
                }]
            }
        });
}

stateConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];

export default stateConfiguration;
