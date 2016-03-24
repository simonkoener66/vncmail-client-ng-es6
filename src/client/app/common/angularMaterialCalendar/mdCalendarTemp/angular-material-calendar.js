
angular.module("materialCalendar").directive("calendarMd", ["$compile", "$parse", "$http", "$q", "materialCalendarService", "materialCalendarDataService", function ($compile, $parse, $http, $q, Calendar, CalendarData) {

    var defaultTemplate = "/* angular-material-calendar.html */";

    var injectCss = function () {
        var styleId = "calendarMdCss";
        if (!document.getElementById(styleId)) {
            var head = document.getElementsByTagName("head")[0];
            var css = document.createElement("style");
            css.type = "text/css";
            css.id = styleId;
            css.innerHTML = "/* angular-material-calendar.css */";
            head.insertBefore(css, head.firstChild);
        }
    };

    return {
        restrict: "E",
        scope: {
            ngModel: "=?",
            template: "&",
            templateUrl: "=?",
            onDayClick: "=?",
            onPrevMonth: "=?",
            onNextMonth: "=?",
            calendarDirection: "=?",
            dayContent: "&?",
            timezone: "=?",
            titleFormat: "=?",
            dayFormat: "=?",
            dayLabelFormat: "=?",
            dayLabelTooltipFormat: "=?",
            dayTooltipFormat: "=?",
            weekStartsOn: "=?",
            tooltips: "&?",
            clearDataCacheOnLoad: "=?",
            disableFutureSelection: "=?"
        },
        link: function ($scope, $element, $attrs) {

            // Add the CSS here.
            injectCss();

            var date = new Date();
            var month = parseInt($attrs.startMonth || date.getMonth());
            var year = parseInt($attrs.startYear || date.getFullYear());

            $scope.columnWeekLayout = "column";
            $scope.weekLayout = "row";
            $scope.timezone = $scope.timezone || null;
            $scope.noCache = $attrs.clearDataCacheOnLoad || false;

            // Parse the parent model to determine if it's an array.
            // If it is an array, than we'll automatically be able to select
            // more than one date.
            if ($attrs.ngModel) {
                $scope.active = $scope.$parent.$eval($attrs.ngModel);
                if ($attrs.ngModel) {
                    $scope.$watch("$parent." + $attrs.ngModel, function (val) {
                        $scope.active = val;
                    });
                }
            } else {
                $scope.active = null;
            }

            // Set the defaults here.
            $scope.titleFormat = $scope.titleFormat || "MMMM yyyy";
            $scope.dayLabelFormat = $scope.dayLabelFormat || "EEE";
            $scope.dayLabelTooltipFormat = $scope.dayLabelTooltipFormat || "EEEE";
            $scope.dayFormat = $scope.dayFormat || "d";
            $scope.dayTooltipFormat = $scope.dayTooltipFormat || "fullDate";
            $scope.disableFutureSelection = $scope.disableFutureSelection || false;

            $scope.sameMonth = function (date) {
                var d = angular.copy(date);
                return d.getFullYear() === $scope.calendar.year &&
                    d.getMonth() === $scope.calendar.month;
            };

            $scope.isDisabled = function (date) {
                if ($scope.disableFutureSelection && date > new Date()) { return true; }
                return !$scope.sameMonth(date);
            };

            $scope.calendarDirection = $scope.calendarDirection || "horizontal";

            $scope.$watch("calendarDirection", function (val) {
                $scope.weekLayout = val === "horizontal" ? "row" : "column";
            });

            $scope.$watch("weekLayout", function () {
                year = $scope.calendar.year;
                month = $scope.calendar.month;
                bootstrap();
            });

            var handleCb = function (cb, data) {
                (cb || angular.noop)(data);
            };

            var dateFind = function (arr, date) {
                var index = -1;
                angular.forEach(arr, function (d, k) {
                    if (index < 0) {
                        if (angular.equals(date, d)) {
                            index = k;
                        }
                    }
                });
                return index;
            };

            $scope.isActive = function (date) {
                var match;
                var active = angular.copy($scope.active);
                if (!angular.isArray(active)) {
                    match = angular.equals(date, active);
                } else {
                    match = dateFind(active, date) > -1;
                }
                return match;
            };

            $scope.prev = function () {
                $scope.calendar.prev();
                var data = {
                    year: $scope.calendar.year,
                    month: $scope.calendar.month + 1
                };
                setData();
                handleCb($scope.onPrevMonth, data);
            };

            $scope.next = function () {
                $scope.calendar.next();
                var data = {
                    year: $scope.calendar.year,
                    month: $scope.calendar.month + 1
                };
                setData();
                handleCb($scope.onNextMonth, data);
            };

            $scope.handleDayClick = function (date) {

                if($scope.disableFutureSelection && date > new Date()) {
                    return;
                }

                var active = angular.copy($scope.active);
                if (angular.isArray(active)) {
                    var idx = dateFind(active, date);
                    if (idx > -1) {
                        active.splice(idx, 1);
                    } else {
                        active.push(date);
                    }
                } else {
                    if (angular.equals(active, date)) {
                        active = null;
                    } else {
                        active = date;
                    }
                }

                $scope.active = active;
                if ($attrs.ngModel) {
                    $parse($attrs.ngModel).assign($scope.$parent, angular.copy($scope.active));
                }

                handleCb($scope.onDayClick, angular.copy(date));

            };

            // Small helper function to set the contents of the template.
            var setTemplate = function (contents) {
                $element.html(contents);
                $compile($element.contents())($scope);
            };

            var init = function () {

                $scope.calendar = new Calendar(year, month, {
                    weekStartsOn: $scope.weekStartsOn || 0
                });

                var deferred = $q.defer();
                // Allows fetching of dynamic templates via $http.
                if ($scope.templateUrl) {
                    $http
                        .get($scope.templateUrl)
                        .success(deferred.resolve)
                        .error(deferred.reject);
                } else {
                    deferred.resolve($scope.template() || defaultTemplate);
                }

                return deferred.promise;

            };




            $scope.dataService = CalendarData;

            // Set the html contents of each date.
            var getDayKey = function (date) {
                return $scope.dataService.getDayKey(date);
            };
            $scope.dayKey = getDayKey;

            var getDayContent = function (date) {

                // Initialize the data in the data array.
                if ($scope.noCache) {
                    $scope.dataService.setDayContent(date, "");
                } else {
                    $scope.dataService.setDayContent(date, ($scope.dataService.data[getDayKey(date)] || ""));
                }

                var cb = ($scope.dayContent || angular.noop)();
                var result = (cb || angular.noop)(date);

                // Check for async function. This should support $http.get() and also regular $q.defer() functions.
                if (angular.isObject(result) && "function" === typeof result.success) {
                    result.success(function (html) {
                        $scope.dataService.setDayContent(date, html);
                    });
                } else if (angular.isObject(result) && "function" === typeof result.then) {
                    result.then(function (html) {
                        $scope.dataService.setDayContent(date, html);
                    });
                } else {
                    $scope.dataService.setDayContent(date, result);
                }

            };

            var setData = function () {
                angular.forEach($scope.calendar.weeks, function (week) {
                    angular.forEach(week, getDayContent);
                });
            };

            window.data = $scope.data;

            var bootstrap = function () {
                init().then(function (contents) {
                    setTemplate(contents);
                    setData();
                });
            };

            $scope.$watch("weekStartsOn", init);
            bootstrap();

            // These are for tests, don't remove them..
            $scope._$$init = init;
            $scope._$$setTemplate = setTemplate;
            $scope._$$bootstrap = bootstrap;

        }
    };

}]);
