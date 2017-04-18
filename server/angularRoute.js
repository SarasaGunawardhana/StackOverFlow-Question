app.config(function ($routeProvider) {

		$routeProvider.when('/', {
				templateUrl: '../views/login.html',
				controller: 'loginController'
		}).when('/home', {
				templateUrl: '../views/home.html',
				controller: 'homeController'
		}).when('/about', {
				templateUrl: '../views/about.html',
				controller: 'studentController'
		}).otherwise({
				redirectTo: "/"
		});
});
