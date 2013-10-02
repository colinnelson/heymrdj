Players = new Meteor.Collection("players");
State = new Meteor.Collection("state");
Questions = new Meteor.Collection("questions");

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

  // Returns Players for Score Card
  Template.score_card.players = function () {
    //players = Players.find({});
    var scores = {};


    players = Players.find({});
    players.forEach(function (player) {
       console.log(player);
        scores[player._id] = {score:100, name:player.name};
    });


    questions = Questions.find({});
    questions.forEach(function (question) {
      for(var i=0;i<question.bets.length; i++){
        scores[question.bets[i].user].score += (question.bets[i].choiceIndex==question.outcomeIndex)?question.bets[i].value:question.bets[i].value*-1;
        
      }
      
    });

    playerArr = [];
    for(e in scores){
      playerArr.push({id:e, name:scores[e].name, score:scores[e].score})
    }
    return playerArr;


  }

  // Returns Players for Score Card
  Template.score_card.yourscore = function () {
    if (typeof Players.findOne({_id: SessionAmplify.get('player')}) != 'undefined') {
          return Players.findOne({_id: SessionAmplify.get('player')}).score;
    }
    else {
      return 0;
    }
  }

  Template.client_question_list.questions = function () {
    return Questions.find({}, {sort: {timestamp: -1}});
  }

  // Just testing click events heres
  Template.client_question_list.events({
    'click div.answer1': function () {  
      Meteor.call("placeBet", SessionAmplify.get('player'), this._id, 1, 1, function (error, result) { if(error!==undefined)alert(error); alert(result); } );
      
    },
    'click div.answer2': function () {  
      Meteor.call("placeBet", SessionAmplify.get('player'), this._id, 2, 1, function (error, result) { if(error!==undefined)alert(error); } );
     
    }
  });

  // Returns a class if the person in the score board matches
  Template.score.isme = function() {
    return SessionAmplify.equals('player', this._id) ? "me" : "";
  }


  // Add new user sign up binding
  Template.signup.events({
    'click #name_submit': function (e) {
      var target = $('#name').val();
      if (target.toLowerCase() == 'admin') {
        $('form').remove();
        $('body').append(Meteor.render(Template.admin));
        SessionAmplify.set('admin', true);
      } else if (target !== '') {
        Players.insert({name: target, score: 0}, function(e, id){
          SessionAmplify.set('player', id);
          $('form').remove();
          $('body').append(Meteor.render(Template.score_card));
        });
      }
    }
  });
    // Add new user sign up binding
  Template.admin.events({
    'click #question_submit': function (e) {
      var question = $('#question_input').val();
      var choice1 = $('#choice1_input').val();
      var choice2 = $('#choice2_input').val();
      if (question !== '') {
          Questions.insert({question: question, choice1: choice1, choice2: choice2, bets:[], timestamp:new Date().getTime()}, function(e, id){

          $('body div#questionList').empty();
          $('body div#questionList').append(Meteor.render(Template.admin_question_list));
        });
      }
    }, 
    'click div.admin_question_answer': function (e) {  
        var choiceIndex = $(e.currentTarget).attr("choiceIndex");
        Meteor.call("setQuestionOutcome", this._id, choiceIndex, function (error, result) { if(error!==undefined) alert(error); } );
         
    }
  });

  Template.admin_question_list.questions = function () {
    return Questions.find({}, {sort: {timestamp: -1}});
  }

  // On Startup, see where we should be
  Meteor.startup(function () {
  });
}

if (Meteor.isServer) {
    // code to run on server at startup
}
