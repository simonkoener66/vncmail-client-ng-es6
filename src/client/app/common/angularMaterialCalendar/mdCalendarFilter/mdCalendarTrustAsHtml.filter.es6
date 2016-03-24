let mdCalendarTrustAsHtmlFilter = ($sce)=> {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
};

mdCalendarTrustAsHtmlFilter.$inject = ['$sce'];

export default mdCalendarTrustAsHtmlFilter;
