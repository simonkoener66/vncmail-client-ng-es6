let exceptionComponent = ($q, logger) => {
    return {
        catcher: catcher
    };

    function catcher(message) {
        return function(e) {
            let thrownDescription;
            let newMessage;
            if (e.data && e.data.description) {
                thrownDescription = '\n' + e.data.description;
                newMessage = message + thrownDescription;
            }
            e.data.description = newMessage;
            logger.error(newMessage);
            return $q.reject(e);
        };
    }
};

exceptionComponent.$inject = ['$q', 'logger'];
/* @ngInject */

export default exceptionComponent;
