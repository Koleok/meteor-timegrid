/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
  timers: function () {
    return Template.instance().timers();
  }
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var subscription = instance.subscribe('timers');
  });

  instance.timers = function() { 
    return Timers.find();
  }
});

Template.Home.onRendered(function() {
    var cw = $('.square').width();
    $('.square').css({
        'height': cw + 'px'
    });
});

Template.Home.onDestroyed(function() {});