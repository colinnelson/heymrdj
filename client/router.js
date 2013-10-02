var SessionAmplify = _.extend({}, Session, {
    keys: _.object(_.map(amplify.store(), function (value, key) {
      return [key, JSON.stringify(value)];
    })),
    set: function (key, value) {
      Session.set.apply(this, arguments);
      amplify.store(key, value);
    }
  });
Meteor.Router.add({
  '/admin': 'admin', // renders template 'admin'
  '': function(){
  	if (!SessionAmplify.get('player')) {
      return 'signup';
    } else {
      return 'client_question_list';
    }
  },
  '*': 'not_found'
});