import angular from 'angular';

let preferencesService = angular.module('preference')

.factory('prefService', prefService);

prefService.$inject = ['$http'];

function prefService () {
	var service = {
		getUserPreferences: getUserPreferences,
		setUserPreferences: setUserPreferences,
		getGlobalConfiguration: getGlobalConfiguration,
		setGlobalConfiguration: setGlobalConfiguration,
		getXMPPConfiguration: getXMPPConfiguration,
		getUserPreference: getUserPreference,
		setUserPreference: setUserPreference,
		getGlobalPreference: getGlobalPreference,
		setGlobalPreference: setGlobalPreference
	}

	return service;

	function getUserPreferences() {
		var preferences = {};
		$http({
			method: 'get',
			headers: {
				'Content-Type': 'application/octet-stream'
			},
			url: '/middleware/rest/appPrefs',
			params: {
				appName: 'vnctalk',
				userSpecific: true
			}
		})
		.then(function (response) {
			preferences = response.result.Preferences;
			localStorage.setItem('userPrefrences', preferences);
		});
	}

	function setUserPreferences(preferencs) {
		for (var key in preferences) {
			$http({
				method: "put",
				headers: {
					'Content-Type': 'application/octet-stream'
				},
				url: "/middleware/rest/appPrefs/user/vnctalk/" + key,
				data: preferences[key]
			}).then(function (response) {
				updateStorage('userPrefrences', key, preferences[key])
			})
		}
	}

	function getGlobalConfiguration() {
		$http({
			method: 'get',
			headers: {
				'Content-Type': 'application/octet-stream'
			},
			url: '/middleware/rest/appPrefs',
			params: {
				appName: 'vnctalk',
				global: true
			}
		})
		.then(function (response) {
			preferences = response.result.Preferences;
			localStorage.setItem('globalConfiguration', preferences);
		});
	}

	function setGlobalConfiguration(configurations) {
		for (let key in configurations) {
			$http({
				method: 'put',
				headers: {
					'Content-Type': 'application/octe-stream'
				},
				url: "/middleware/rest/appPrefs/global/vnctalk/" + key,
				data: configurations[key]
			}).then(function () {
				updateStorage('globalConfiguration', key, configurations[key]);
			})
		}
	}

	function getXMPPConfiguration() {
		return true;
	}

	function getUserPreference(prefName) {
		return getStorage('userPrefrences', prefName);
	}

	function setUserPreference(prefName, newValue, callback) {
		updateStorage('userPrefrences', prefName, newValue);
		$http({
			method: "put",
			headers: {
				'Content-Type': 'application/octet-stream'
			},
			url: "/middleware/rest/appPrefs/user/vnctalk/" + prefName,
			data: newValue
		}).then(function (response) {
			if (typeof callback == 'function')
				callback(response);
		}, function (response) {
			if (typeof callback == 'function')
				callback(response);
		})
	}

	function getGlobalPreference(prefName) {
		return getStorage('globalConfiguration', prefName);
	}

	function setGlobalPreference(prefName, newValue, callback) {
		updateStorage('globalConfiguration', prefName, newValue);

		$http({
			method: 'put',
			headers: {
				'Content-Type': 'application/octe-stream'
			},
			url: "/middleware/rest/appPrefs/global/vnctalk/" + prefName,
			data: newValue
		}).then(function (response) {
			if (typeof callback === 'function')
				callback(response);
		}, function (response) {
			if (typeof callback === 'function')
				callback(response);
		})

	}

	function updateStorage(item, prefName, newValue) {
		var localPrefs = localStorage.getItem(item);
		if (!_.isEmpty(localPrefs)) {
			localPrefs.forEach(function (el, index, array) {
				if (el.PreferenceName == prefName) {
					el.Content = newValue;
					break;
				}
			});
			localStorage.setItem(item, localPrefs);
		}
	}

	function getStorage(item, prefName) {
		var localPrefs = localStorage.getItem(item);
		if (!_.isEmpty(localPrefs)) {
			localPrefs.forEach(function (el, index, array) {
				if (el.PreferenceName == prefName) {
					return el.Content;
				}
			});
		}
		return undefined;
	}
}

export default preferencesService;
