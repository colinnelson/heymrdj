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
  '/heydj/dj': 'dj_view', // renders template 'dj_view'
  '/heydj/':'client_view',  
  '*': 'not_found'
});