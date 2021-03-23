(function(angular) {
    'use strict';
    const app = angular.module("todo", []);

    const apiUri = 'http://localhost:82';

    const TASK_STATUS_TODO = 0;
    const TASK_STATUS_DOING = 1;
    const TASK_STATUS_DONE = 2;

    app.controller("mainController", function($scope, $http) {
        $scope.comments = [];
        $scope.tasks = [];
        $scope.todoTasks = [];
        $scope.doingTasks = [];
        $scope.doneTasks = [];

        $scope.loadTasks = function() {
            $scope.tasks = [];

            $http.get(apiUri + '/tasks').
            then(function success(response) {
                    $scope.tasks = response.data.items;
                    $scope.syncTasks();
                }, function error(response){
                    console.log("Error");
                    console.log("response code: " + response.status);
                }
            );
        };

        $scope.startEdit = function(task) {
            $scope.comments = [];
            $http.get(apiUri + '/comments?task_id=' + task.id).
            then(function success(response) {
                    $scope.comments = response.data.items;
                }, function error(response){
                    console.log("Error");
                    console.log("response code: " + response.status);
                }
            );

            $scope.chooseCurrentTask(task);
        };

        $scope.addComment = function() {
            $http.post(apiUri + '/comments', {text: $scope.createCommentText, task_id: $scope.currentTask.id}).
            then(function success(response) {
                    $scope.comments.push(response.data.details);
                }, function error(response){
                    console.log("Error");
                    console.log("response code: " + response.status);
                }
            );
        };

        $scope.chooseCurrentTask = function(task) {
            $scope.currentTask = task;
        };

        $scope.delete = function() {
            $http.delete(apiUri + '/tasks/' + $scope.currentTask.id).
            then(function success(response) {
                    $scope.tasks.forEach((task, key) => {
                        if ($scope.currentTask.id === task.id) {
                            $scope.tasks.splice(key, 1);
                            $scope.syncTasks();
                        }
                    });
                }, function error(response){
                    console.log("Error");
                    console.log("response code: " + response.status);
                }
            );
        };

        $scope.changeStatus = function(currentTask, status) {
            $http.patch(apiUri + '/tasks/' + currentTask.id, {status: status}).
            then(function success(response) {
                $scope.tasks.forEach((task, key) => {
                    if (currentTask.id === task.id) {
                        $scope.tasks.splice(key, 1);
                        $scope.tasks.push(response.data.details);
                        $scope.syncTasks();
                    }
                });
                }, function error(response){
                    console.log("Error");
                    console.log("response code: " + response.status);
                }
            );
        };

        $scope.update = function(i) {
            $http.patch(apiUri + '/tasks/' + $scope.currentTask.id, {name: $scope.currentTask.name, status: $scope.currentTask.status}).
            then(function success(response) {
                }, function error(response){
                    console.log("Error");
                    console.log("response code: " + response.status);
                }
            );
        };

        $scope.addTask = function() {
            $http.post(apiUri + '/tasks', {'name': $scope.createTodoTaskName}).
            then(function success(response) {
                    $scope.tasks.push(response.data.details);
                    $scope.syncTasks();
                }, function error(response){
                    console.log("Error");
                    console.log("response code: " + response.status);
                }
            );
        }

        $scope.syncTasks = function () {
            $scope.todoTasks = [];
            $scope.doingTasks = [];
            $scope.doneTasks = [];

            angular.forEach($scope.tasks, function(task) {
                switch (task.status) {
                    case TASK_STATUS_TODO:
                        $scope.todoTasks.push(task);
                        break;
                    case TASK_STATUS_DOING:
                        $scope.doingTasks.push(task);
                        break;
                    default:
                        $scope.doneTasks.push(task);
                        break;
                }
            });
        }

        $scope.loadTasks();
    });
})(window.angular);