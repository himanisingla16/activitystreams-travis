const adapterDAO = require('../../../dao/cassandra/adapter');
const activityDao = require('../../../dao/cassandra/activity');


function publishActivityToDomain(req, res) {
  const newActivity = {
    payload: req.body,
    timestamp: new Date(),
  };
  newActivity.payload.requestedAt = new Date();
  adapterDAO.checkIfDomainExists(req.params.domain, (error, doesDomainExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesDomainExists) {
      res.status(404).json({ message: 'Domain does not exist' });
      return;
    }
    const circleId = (doesDomainExists.circleid).toString();
    activityDao.createPublishActivity(circleId, newActivity, (error1, data1) => {
      if (error1) { res.status(404).json({ message: `${error1}` }); return; }
      //console.log(newActivity);
      res.status(201).json(data1);
     
    });
  });
}

function publishActivityToUser(req, res) {
  const newActivity = {
    payload: req.body,
    timestamp: new Date(),
  };
  newActivity.payload.requestedAt = new Date();
  adapterDAO.checkIfUserExists(req.params.user, (error, doesUserExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesUserExists) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }
    const mailboxId = (doesUserExists.mailboxid).toString();
    activityDao.publishToMailbox(mailboxId, newActivity, (error1, data) => {
      if (error1) { res.status(404).json({ message: `${error1}` }); return; }
      res.status(201).json(data);
    });
  });
}


function getAllActivitiesForUser(req, res) {
  const limit = req.query.limit;
  const before = req.query.before;
  const after = req.query.after;
  adapterDAO.checkIfUserExists(req.params.user, (error, doesUserExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesUserExists) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }
    const mailboxId = (doesUserExists.mailboxid).toString();
    activityDao.retriveMessageFromMailbox(mailboxId, before, after, limit, (err, result) => {
      if (err) { res.status(500).json({ message: `${err}` }); return; }
      if(result.b){
        result.b.forEach(element => {
          element.payload = JSON.parse(element.payload);
        });
      }

         const firstActivity = result.b[0];
         const lastActivity = result.b[result.b.length - 1];
         res.status(201).json({totalItems: result.a, items: result.b, first: firstActivity, last: lastActivity});
      });
  });
}

function getAllActivitiesForDomain(req,res){
  const limit = req.query.limit;
  const before = req.query.before;
  const after = req.query.after;
   adapterDAO.checkIfDomainExists(req.params.domain, (error, doesDomainExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesDomainExists) {
      res.status(404).json({ message: 'Domain does not exist' });
      return;
    }
    const mailboxId = (doesDomainExists.mailboxid).toString();
    console.log(mailboxId);
     activityDao.retriveMessageFromMailbox(mailboxId, before, after, limit, (err, result) => {
      if (err) { res.status(500).json({ message: `${err}` }); return; }
      if(result.b){
        result.b.forEach(element => {
          element.payload = JSON.parse(element.payload);
        });
      }

       const firstActivity =  (result.a !== 0) ? result.b[0] : [];
       const lastActivity = (result.a !== 0) ? result.b[result.b.length - 1] : [];
       res.status(201).json({totalItems: result.a, items: result.b, first: firstActivity, last: lastActivity});
     });
   });
}

module.exports = {
  publishActivityToDomain, publishActivityToUser, getAllActivitiesForUser,getAllActivitiesForDomain,
};

