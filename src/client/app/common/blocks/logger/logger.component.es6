let loggerComponent = () => {

    return {
        showToasts: true,
        error   : error,
        info    : info,
        success : success,
        warning : warning
    };
    /////////////////////
    function error(message, data, title) {
      console.log(message, data, title);
      var event = new CustomEvent('callToastError', {'detail': message});
      document.dispatchEvent(event);
    }

    function info(message, data, title) {
      console.log(message, data, title);
      var event = new CustomEvent('callToastInfo', {'detail': message});
      document.dispatchEvent(event);
    }

    function success(message, data, title) {
      console.log(message, data, title);
      var event = new CustomEvent('callToastSuccess', {'detail': message});
      document.dispatchEvent(event);
    }

    function success(message, data, title) {
        var event = new CustomEvent('callToastSuccess', {'detail': message});
        document.dispatchEvent(event);
    }

    function warning(message, data, title) {
      console.log(message, data, title);
      var event = new CustomEvent('callToastWarning', {'detail': message});
      document.dispatchEvent(event);
    }
};

export default loggerComponent;
