/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  'server/update_stamp': function(timer, isInStamp) {
        var session = {};

        if (isInStamp) {
            var newStamp = {};
            newStamp.timeIn = new Date;

            Timers.update(timer._id, {
                $push: {
                    sessions: newStamp
                }
            });
        } else {
            session = _.last(timer.sessions);

            var tIn = session.timeIn;
            var tOut = new Date;

            Timers.update({
                _id: timer._id,
                "sessions.timeIn": tIn
            }, {
                $set: {
                    "sessions.$.timeOut": tOut
                }
            });
        }
    }
});
