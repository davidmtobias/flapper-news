var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', [function(){
  var o = {
    posts:  [
  {title: 'post 1', upvotes: 5,
  comments: [
            {author: 'Pepe', body: 'Cool post!', upvotes: 0}

        ]

  },
  {title: 'post 2', upvotes: 442, comments: []},
  {title: 'post 3', upvotes: 15},
  {title: 'post 4', upvotes: 9},
  {title: 'post 5', upvotes: 4}
    ]
  };
  return o;
}]);

//Routing
app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })

    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });


  $urlRouterProvider.otherwise('home');
}]);


//Controllers
app.controller('MainCtrl', [
'$scope',
'posts',  //Injecting the service into controller
function($scope, posts){
    $scope.posts = posts.posts;

    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,

          //Fake comments
        comments: [
            {author: 'Joe', body: 'Cool post!', upvotes: 0},
            {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        ]
      });

      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post) {
        post.upvotes += 1;
    };

}]);

app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts){
    $scope.post = posts.posts[$stateParams.id];


 $scope.addComment = function(){
  if($scope.body === '') { return; }
  $scope.post.comments.push({
    body: $scope.body,
    author: 'user',
    upvotes: 0
  });
  $scope.body = '';
  };


}]);



