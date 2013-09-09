Scores = new Meteor.Collection("scores");

if (Meteor.isClient) {

  // Augments Session w/ Local Storage
  var SessionAmplify = _.extend({}, Session, {
    keys: _.object(_.map(amplify.store(), function (value, key) {
      return [key, JSON.stringify(value)];
    })),
    set: function (key, value) {
      Session.set.apply(this, arguments);
      amplify.store(key, value);
    }
  });

  // Returns Scores for Score Card
  Template.score_card.scores = function () {
    return Scores.find({}, {sort: {score: -1, name: 1}});
  }

  // Returns a class if the person in the score board matches
  Template.score.isme = function() {
    return SessionAmplify.equals('player', this._id) ? "me" : "";
  }

  // Just testing click events here
  Template.score.events({
    'click li': function () {
      if (SessionAmplify.equals('player', this._id)) {
              Scores.update(this._id, {$inc: {'score': 1}});
      } else {
              Scores.update(this._id, {$inc: {'score': -1}});

      }
    }
  });

  // Add new user sign up binding
  Template.signup.events({
    'click #name_submit': function (e) {
      var target = $('#name').val();
      if (target.toLowerCase() == 'admin') {
        $('form').remove();
        $('body').append(Meteor.render(Template.admin));
        SessionAmplify.set('admin', true);
      } else if (target !== '') {
        Scores.insert({name: target, score: 0}, function(e, id){
          SessionAmplify.set('player', id);
          $('form').remove();
          $('body').append(Meteor.render(Template.score_card));
        });
      }
    }
  });

  // On Startup, see where we should be
  Meteor.startup(function () {
    if (!SessionAmplify.get('player')) {
      $('body').append(Meteor.render(Template.signup));
    } else if (SessionAmplify.get('admin')) {
      $('body').append(Meteor.render(Template.admin));
    } else {
      $('body').append(Meteor.render(Template.score_card));
    }
  });
}

if (Meteor.isServer) {
    // code to run on server at startup
}
