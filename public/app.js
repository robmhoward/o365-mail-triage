var o365CorsApp = angular.module("o365CorsApp", ['ngRoute', 'AdalAngular'])

o365CorsApp.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {  
	$routeProvider
		.when('/',
			{
				controller: 'HomeController',
				templateUrl: 'partials/home.html',
				requireADLogin: true
			})
		.otherwise({redirectTo: '/' });

	var adalConfig = {
		tenant: 'common', 
		clientId: '36844bfb-8656-4d33-8776-187ca3bf5163', 
		extraQueryParameter: 'nux=1',
		endpoints: {
			"https://graph.microsoft.com": "https://graph.microsoft.com"
		}
	};
	
	adalProvider.init(adalConfig, $httpProvider); 

}]);


o365CorsApp.factory('o365CorsFactory', ['$http', function ($http) {
	var factory = {};

	$http.defaults.useXDomain = true;

	factory.getMessages = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages');
	}
    
    factory.getInboxInfo = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/mailFolders/Inbox');
	}

    factory.moveMessageToSort = function(messageId) {
		return $http.post(
            'https://graph.microsoft.com/v1.0/me/messages/' + messageId + '/move',
            { "destinationId": "AAMkAGQ5MGIyODY4LTg0MTEtNDVkOC1iYTE1LWU5NjYwYjMxNzRmOQAuAAAAAABlDZTRoj6wTqag8Dj1DWJ6AQAPwSiPJrG6R6-c1CxJ2auaAABZJ5dfAAA=" }
        );
	}

    factory.moveMessageToRead = function(messageId) {
		return $http.post(
            'https://graph.microsoft.com/v1.0/me/messages/' + messageId + '/move',
            { "destinationId": "AAMkAGQ5MGIyODY4LTg0MTEtNDVkOC1iYTE1LWU5NjYwYjMxNzRmOQAuAAAAAABlDZTRoj6wTqag8Dj1DWJ6AQAPwSiPJrG6R6-c1CxJ2auaAABZJ5dgAAA=" }
        );
	}
    
    factory.deleteMessage = function(messageId) {
		return $http.delete('https://graph.microsoft.com/v1.0/me/messages/' + messageId);
	}

factory.getMessages = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/messages');
	}

factory.getMessages = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/messages');
	}

factory.getMessages = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/messages');
	}

factory.getMessages = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/messages');
	}

factory.getMessages = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/messages');
	}




	factory.getMessages = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/messages');
	}

	return factory;
}]);

o365CorsApp.controller("HomeController", function($scope, $q, o365CorsFactory) {

    $scope.moveToRead = function(messageId) {
        o365CorsFactory.moveMessageToRead(messageId).then(function () {
           removeMessageFromScope(messageId); 
        });
    };
    
    $scope.moveToSort = function(messageId) {
        alert(messageId);
    };
    
    $scope.deleteMessage = function(messageId) {
        alert(messageId);
    };
    

	$scope.messages = [{Subject: "Loading..."}];
	
	o365CorsFactory.getMessages().then(function(response) {
		$scope.messages = response.data.value;
	});

    function removeMessageFromScope(messageId) {
        for (var i = 0; i < $scope.messages.length; i++ )
        {
            if ($scope.messages[i].id = messageId) {
                $scope.messages.splice(i, 1);
            }
        }
    }

});