const start = require('../../../db');
const config = require('../../../config');
const client = start.client;
const activityDAO = require('../../index').activity;
const followDAO = require('../../index').follow;
const circleDAO = require('../../index').circle;

function getOpenMailboxes(range, callback) {
  const offset = parseInt(range.offset);
  const count = parseInt(range.count);
  const users = (Object.keys(activityDAO.listeners)).slice(offset, (offset+count));
  const response = {
    record_count: users.length,
    total_count: Object.keys(activityDAO.listeners).length,
    records: users,
  };
  return callback(null, response);
}


function getAllActivitiesOfACircle(circleId, range, callback) {
  const before=parseInt(range.before);
  const after=parseInt(range.after);
  const limit= parseInt(range.limit);
  const activityObject = (activityDAO.activities).filter(activity => activity.circleId === circleId);
  const activity= activityObject.map(filteredActivity => filteredActivity.mailboxId)
    .slice(after, (after+limit));
  const response = {
    record_count: activity.length,
    total_count: activityObject.length,
    records: activity,
  };

  callback(null, response);
}
function getAllCircles(mailboxId, callback) {
     const query = (`SELECT * from circlesfollowedbymailbox where mailboxId = ${mailboxId}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
     
       let a = result.rows.length;
      let b = result.rows;
      return callback(null, {a,b});
           });
  }


module.exports = {
  getOpenMailboxes,
  getAllCircles,
  getAllActivitiesOfACircle,
};
