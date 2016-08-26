var o365CorsApp = angular.module("o365CorsApp", ['ngRoute', 'AdalAngular'])

o365CorsApp.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {  
	$routeProvider
		.when('/',
			{
				controller: 'HomeController',
				templateUrl: 'partials/home.html',
				requireADLogin: true
			})
		.when('/sort',
			{
				controller: 'SortController',
				templateUrl: 'partials/sort.html',
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

	var sortFolderId = "AAMkAGQ5MGIyODY4LTg0MTEtNDVkOC1iYTE1LWU5NjYwYjMxNzRmOQAuAAAAAABlDZTRoj6wTqag8Dj1DWJ6AQAPwSiPJrG6R6-c1CxJ2auaAABZJ5dfAAA=";
	var readFolderId = "AAMkAGQ5MGIyODY4LTg0MTEtNDVkOC1iYTE1LWU5NjYwYjMxNzRmOQAuAAAAAABlDZTRoj6wTqag8Dj1DWJ6AQAPwSiPJrG6R6-c1CxJ2auaAABZJ5dgAAA=";

	$http.defaults.useXDomain = true;

	factory.getInboxMessages = function() {
		var now = new Date();
		var dateString = (new Date(now.getFullYear(), now.getMonth(), now.getDate())).toISOString();
		return $http.get('https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$filter=receivedDateTime gt ' + dateString + '&$orderby=receivedDateTime desc&$select=subject,sender,bodyPreview');
	}

	factory.getSortMessages = function() {
		var now = new Date();
		var dateString = (new Date(now.getFullYear(), now.getMonth(), now.getDate())).toISOString();
		return $http.get('https://graph.microsoft.com/v1.0/me/mailFolders/' + sortFolderId + '/messages?$filter=receivedDateTime gt ' + dateString + '&$orderby=receivedDateTime desc&$select=subject,sender,bodyPreview');
	}

	factory.searchForFolder = function(searchString) {
		return $http.get('https://graph.microsoft.com/v1.0/me/mailFolders/' + sortFolderId + '/messages?$filter=receivedDateTime gt ' + dateString + '&$orderby=receivedDateTime desc&$select=subject,sender,bodyPreview');
	}

    factory.getInboxInfo = function() {
		return $http.get('https://graph.microsoft.com/v1.0/me/mailFolders/Inbox');
	}

    factory.moveMessageToSort = function(messageId) {
		return $http.post(
            'https://graph.microsoft.com/v1.0/me/messages/' + messageId + '/move',
            { "destinationId": sortFolderId }
        );
	}

    factory.moveMessageToRead = function(messageId) {
		return $http.post(
            'https://graph.microsoft.com/v1.0/me/messages/' + messageId + '/move',
            { "destinationId": readFolderId }
        );
	}
    
    factory.deleteMessage = function(messageId) {
		return $http.delete('https://graph.microsoft.com/v1.0/me/messages/' + messageId);
	}
    
	return factory;
}]);

o365CorsApp.controller("SortController", function($scope, $q, o365CorsFactory) {
	o365CorsFactory.getSortMessages().then(function(response) {
		$scope.messages = response.data.value;
	});

	o365CorsFactory.get
});

o365CorsApp.controller("HomeController", function($scope, $q, o365CorsFactory) {

	$scope.refresh = function() {
		o365CorsFactory.getInboxMessages().then(function(response) {
			$scope.messages = response.data.value;
		});		
	}

    $scope.moveToRead = function(messageId) {
        o365CorsFactory.moveMessageToRead(messageId).then(function () {
           removeMessageFromScope(messageId); 
        });
    };
    
    $scope.moveToSort = function(messageId) {
        o365CorsFactory.moveMessageToSort(messageId).then(function () {
           removeMessageFromScope(messageId); 
        });
    };
    
    $scope.deleteMessage = function(messageId) {
        o365CorsFactory.deleteMessage(messageId).then(function () {
           removeMessageFromScope(messageId); 
        });
    };

	$scope.messages = [{Subject: "Loading..."}];
	
	o365CorsFactory.getInboxMessages().then(function(response) {
		$scope.messages = response.data.value;
	});

	o365CorsFactory.getInboxInfo().then(function(response) {
		$scope.messageCount = response.data.totalItemCount;
	});

});

function removeMessageFromScope(messageId) {
	for (var i = 0; i < $scope.messages.length; i++ )
	{
		if ($scope.messages[i].id == messageId) {
			$scope.messages.splice(i, 1);
			break;
		}
	}
}