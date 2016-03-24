let mailFilterByDateService = function( $filter, moment ){

    moment.locale('en');
    let REFERENCE = moment();
    let REFERENCEDAY = REFERENCE.day() - 2;  // to start week from monday
    let REFERENCEMONTH = REFERENCE.month();
    let REFERENCEYEAR = REFERENCE.year();

    this.filterByDate = ( emails, normalizedEmails, search, cb ) => {
        let newList = search ? groupBySearch(normalizedEmails) : groupByDate(normalizedEmails);
        let mergeArray = merge(emails, newList);
        cb(mergeArray);
    };

    function groupByDate(emails) {
        let groupByEmails = $filter('groupBy')(emails, 'date');
        return normalizeDate(groupByEmails);
    }

    function groupBySearch(emails) {
        return {['Search Results' + (emails.length ? ' (' + emails.length + ') ' : '')]: emails}
    }

    //Normalize date
    function normalizeDate(groupByEmails){
        let result = {};
        for (var i in groupByEmails) {
            let mailDate = new moment(new Date(i));
            let mails = groupByEmails[i];
            if(isToday(mailDate)){
                setMailsDate('Today', mails, result);
            }
            else if(isYesterday(mailDate)){
                setMailsDate('Yesterday', mails, result);
            }
            else if(getDay(mailDate)){
                setMailsDate(getDay(mailDate), mails, result);
            }
            else if(isLastWeek(mailDate)){
                setMailsDate('Last Week', mails, result);
            }
            else if(isTwoWeeksAgo(mailDate)){
                setMailsDate('Two Weeks Ago', mails, result);
            }
            else if(isThreeWeeksAgo(mailDate)){
                setMailsDate('Three Weeks Ago', mails, result);
            }
            else if(isFourWeeksAgo(mailDate)){
              REFERENCEYEAR == mailDate.year() ? setMailsDate('Earlier This Month', mails, result) : setMailsDate('Last Month', mails, result);
            }
            else if(isLastMonth(mailDate)){
                setMailsDate('Last Month', mails, result);
            }
            else if(Older(mailDate)){
                setMailsDate('Older', mails, result);
            }
        }
        return result;
    }

    // get days difference
    function dayDiff(date){
        let dateDiff = date.diff(REFERENCE.clone().startOf('day'), 'days');
        dateDiff = -dateDiff > 0 ? -dateDiff : dateDiff;
        return (REFERENCEDAY + 1) - dateDiff >= 0;
    }

    // get months difference
    function monthDiff(date){
      return REFERENCE.diff(date, 'months');
    }

    // set mails date in array
    function setMailsDate(filter, mails, result){
        if(angular.isArray(result[filter]) && result[filter].length){
            result[filter] = result[filter].concat(mails)
        }
        else result[filter] = mails;
    }

    // date is today
    function isToday(momentDate) {
        return momentDate.isSame(REFERENCE.clone().startOf('day'), 'd');
    }

    // date is Yesterday
    function isYesterday(momentDate) {
        if(dayDiff(momentDate)){
            return momentDate.isSame(REFERENCE.clone().subtract(1, 'days').startOf('day'), 'd');
        }
        else return false;
    }

    // get day of week
    function getDay(momentDate) {
        if(dayDiff(momentDate)){
            if(momentDate.isAfter(REFERENCE.clone().subtract(7, 'days').startOf('day'))){
                return momentDate.format('dddd');
            }
            else return false;
        }
        else return false;
    }

    // Date is in last week
    function isLastWeek(momentDate) {
      if(monthDiff(momentDate) == 0) {
        return momentDate.isBetween(REFERENCE.clone().subtract(REFERENCEDAY + 7, 'days').startOf('day'), REFERENCE.clone().subtract(REFERENCEDAY, 'days').startOf('day'));
      }
    }

    // Date is in two weeks old
    function isTwoWeeksAgo(momentDate) {
      if(monthDiff(momentDate) == 0) {
        return momentDate.isBetween(REFERENCE.clone().subtract(REFERENCEDAY + 14, 'days').startOf('day'), REFERENCE.clone().subtract(REFERENCEDAY + 6, 'days').startOf('day'));
      }
    }

    // Date is in three weeks old
    function isThreeWeeksAgo(momentDate) {
      if(monthDiff(momentDate) == 0) {
        return momentDate.isBetween(REFERENCE.clone().subtract(REFERENCEDAY + 21, 'days').startOf('day'), REFERENCE.clone().subtract(REFERENCEDAY + 13, 'days').startOf('day'));
      }
    }

    // Date is in four weeks old
    function isFourWeeksAgo(momentDate) {
      if(monthDiff(momentDate) == 0){
        return momentDate.isBetween(REFERENCE.clone().subtract(REFERENCEDAY + 30, 'days').startOf('day'), REFERENCE.clone().subtract(REFERENCEDAY + 20, 'days').startOf('day'));
      }
    }

    // Date is in last month
    function isLastMonth(momentDate) {
        return monthDiff(momentDate) == 1;
    }

    // Date is older then last month
    function Older(momentDate) {
        return monthDiff(momentDate) > 1;
    }


    // Deep merge of two objects
    function merge(oldMails, newMails){
        let result = {};
        for(let i in oldMails){
            if((i in newMails) && (typeof oldMails[i] === "object") && (i !== null)){
                result[i] = oldMails[i].concat(newMails[i]); // if it's an object, merge
            }else{
                result[i] = oldMails[i]; // add it to result
            }
        }
        for(let i in newMails){ // add the remaining properties from object 2
            if(i in result){ //conflict
                continue;
            }
            result[i] = newMails[i];
        }
        return result;
    }


};

mailFilterByDateService.$inject = ['$filter', 'moment'];
/*@ngInject*/

export default mailFilterByDateService;
