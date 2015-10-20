// Declare a tick function that updates time with dep tracker each second
var timeTick = new Tracker.Dependency();

/*****************************************************************************/
/* Timer: Event Handlers */
/*****************************************************************************/
Template.Timer.events({
    click: function (event, template) {
        var wasRunning = template.running.get(),
            isClockIn = !wasRunning;
        template.running.set(!wasRunning);

        Meteor.call('server/update_stamp', this, isClockIn);
        // template.start.set(moment());
    }
});

/*****************************************************************************/
/* Timer: Helpers */
/*****************************************************************************/
Template.Timer.helpers({
    running: function () {
        return Template.instance().running.get();
    },

    time: function () {

        if (Template.instance().running.get()) {
            timeTick.depend();
            var start = Template.instance().start.get(),
                now = moment(),
                diffVal = now.diff(start, 'seconds');

            var total = moment.duration(
                Template.instance().elapsed.get() + diffVal, 'seconds'
            );

            Template.instance()
                .duration
                .set(total);
        }

        return formatTime(
            Template.instance().duration.get()
        );
    }
});

/*****************************************************************************/
/* Timer: Lifecycle Hooks */
/*****************************************************************************/
Template.Timer.onCreated(function () {
    var instance = this;

    instance.start = new ReactiveVar;
    instance.start.set(moment());

    instance.running = new ReactiveVar;
    instance.running.set(false);

    instance.elapsed = new ReactiveVar;
    instance.duration = new ReactiveVar;

    instance.autorun(function () {
        instance.elapsed.set(
            getElapsed(instance.data)
        );
    });
});

Template.Timer.onRendered(function () {});

Template.Timer.onDestroyed(function () {});

Meteor.setInterval(function () {
    timeTick.changed();
}, 1000);

var getElapsed = function (timer) {
    var elapsed = _.reduce(timer.sessions, function (memo, s) {
        var tIn = moment(s.timeIn),
            tOut = moment(s.timeOut),
            diff = tOut.diff(tIn, 'seconds');
        return diff + memo;
    }, 0);

    return moment.duration(
        elapsed, 'seconds'
    );
}

var formatTime = function (dur) {
    return dur ? leadingZeroVal(dur.hours()) + ':' +
        leadingZeroVal(dur.minutes()) + ':' +
        leadingZeroVal(dur.seconds()) : '';
}

var leadingZeroVal = function (val) {
    return tempVal(val).slice(-2);
}

var tempVal = function (val) {
    return '0' + Math.round(val);
}