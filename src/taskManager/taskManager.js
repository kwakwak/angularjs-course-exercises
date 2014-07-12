/**
 * Created by Roni on 12/07/2014.
 */

(function() {

    function StorageService ($window) {

        this.saveTasks = function (data) {
            $window.localStorage.setItem('list', JSON.stringify(data));
        };

        this.loadTasks = function () {
            return JSON.parse($window.localStorage.getItem('list'));
        }

        this.tasks = this.loadTasks() || [];

    }
    function tableController(scope,StorageService){
        scope.tasks = StorageService.tasks;

        scope.$on('toggleCompAction', function (event, data) {
            scope.action = data;
        });

        scope.$on('newTask', function(event,data){
            scope.tasks = StorageService.tasks;
        });

        scope.removeTask = function (t) {
            scope.tasks.splice(scope.tasks.indexOf(t), 1);
            StorageService.saveTasks(scope.tasks);
            scope.$emit('removeTask');
        };

        scope.editTask = function (t) {
            scope.task = scope.tasks[scope.tasks.indexOf(t)];
            scope.$emit('editTask', scope.task);
        };

    }
    function addController(scope,StorageService){
        scope.tasks = StorageService.tasks;
        scope.addTask = function (task) {
            if (scope.tasks.indexOf(task) == -1) {
                scope.tasks.push({
                    title: task.title,
                    description: task.description,
                    completed: task.completed
                });
                scope.$emit('addTask');
            }
            StorageService.saveTasks(scope.tasks);
            scope.task = {};
        };

        scope.$on('oldTask', function (event, data) {
            scope.task = data;
        });
    }
    function mainController(scope) {
        scope.$on('addTask', function () {
            scope.$broadcast('newTask');
        });

        scope.$on('removeTask', function () {
            scope.$broadcast('taskRemoved');
        });

        scope.$on('editTask', function (event, data) {
            scope.$broadcast('oldTask', data);
        });

        scope.$on('toggleComp', function (event, data) {
            scope.$broadcast('toggleCompAction', data);
        });

        scope.$on('clear', function () {
            scope.$broadcast('clearLog');
        });
    }
    function logController(scope) {
        scope.log =[];
        scope.$on ('newTask', function(event,data){
            scope.log.push({
                date: new Date(),
                action:  'new task added'
            });
        });
        scope.$on ('taskRemoved', function(event,data){
            scope.log.push({
                date: new Date(),
                action:  'task removed'
            });
        });
        scope.$on ('clearLog', function(){
            scope.log =[];
        });
    }
    function actionController (scope){
        var action = {
            showComp: false
        };

        scope.clear = function(){
            scope.$emit('clear');
        };

        scope.toggleComp = function(){
            action.showComp = !action.showComp;
            scope.$emit('toggleComp',action);
        }
    }

    angular.module('taskManager',[])
        .controller({
            'tableController' : ['$scope','StorageService',tableController],
            'addController' : ['$scope','StorageService', addController],
            'mainController' : ['$scope', mainController],
            'logController' : ['$scope', logController],
            'actionController' : ['$scope', actionController]

        })
        .service('StorageService', StorageService);


}());

