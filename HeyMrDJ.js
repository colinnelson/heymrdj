Songs = new Meteor.Collection("songs");

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
  Template.client_view.songs = function () {
      return Songs.find({status:{$ne:"deleted"}},{sort: {votes:-1}});
  }
  Template.client_view.deleted_songs = function () {
      var deleted = Songs.find({status:"deleted"},{sort: {votes:-1}});
      console.log("deleted");
      console.log(deleted);
      return deleted;
  }
  /*for debugging*/
  window.setSongs = function() {
        insertSong("ZZtop", "La Grange");
        insertSong("Rolling Stones", "Satisfaction");
        insertSong("Rolling Stones", "Paint it Black");
        insertSong("Rolling Stones", "Get Offa My Cloud");
        insertSong("Salt n Pepa", "Push It");
        insertSong("MC HAMMER", "Can't touch this");
        insertSong("The Doors", "Strange");
        insertSong("Johnny Cash", "Hurt" );
  }

  window.insertDuplicateSong = function() {
        insertSong("ZZtopsss", "La Grange");
  }
  function insertSong (p_artist, p_title) {
        var p_title_stripped = p_title.replace(/[^\w]/gi, '').toLowerCase();
        var p_artist_stripped = p_artist.replace(/[^\w]/gi, '').toLowerCase();
        var s = Songs.findOne({title_stripped:p_title_stripped, artist_stripped:p_artist_stripped});
        console.log(s);
        if(s==null){
          Songs.insert({title:p_title, artist: p_artist, title_stripped:p_title_stripped,artist_stripped:p_artist_stripped, votes:0});
        }else{
          Songs.update({_id:s._id}, {$inc:{votes:+1}});
        }

  }

  function clickSong (e) {
      var target = $(e);
      
      Songs.update({_id:this._id}, {$inc:{votes:+1}});
      target.css("background-color","#0000FF");
  }
  function submitSong (e) {
      e.preventDefault();
      var title = $('#title_input').val();
      var artist = $('#artist_input').val();
      $('#title_input').val("");
      $('#artist_input').val("");
      if(title!==""){
        Songs.insert({name:target, votes:0});
      }
      return false;
  }
  var songIds = [];
  Template.client_view.rendered =  function () {
          var unfound = true;
          console.log("changed");
          console.log(this);
          $("#song_list li").each(function(i, t){c
              var sid = $(t).attr("sid");
              //$(t).css({"background-color":"rgb( 255, 255, 255 )"})

              if(songIds[i]!=undefined&&songIds[i]!=sid && unfound){
                  unfound = false;
                  $(t).css({"background-color":"rgb( 10, 255, 10 )"})
                  $(t).animate({"background-color":"rgb( 255, 255, 255 )"},500);
              }

              songIds[i]=sid;
          });

      
  };

  Template.client_view.events({
    'click #song_submit': submitSong,
    'touchstart #song_submit': submitSong,
    'submit':submitSong,
    'click li': clickSong,
    'tap li': clickSong
  });
  $('#song_form').submit(submitSong);
  
  Template.dj_view.songs = function () {
      return Songs.find({status:{$ne:"deleted"}},{sort: {votes:-1}});
  }
  Template.dj_view.deleted_songs = function () {
      var deleted = Songs.find({status:"deleted"},{sort: {votes:-1}});
      console.log("deleted");
      console.log(deleted);
      return deleted;
  }
  Template.dj_view.rendered = function () {
    /*
    if($("li").length>1){
      Meteor.disconnect();
      Meteor.setTimeout(connectMeteor, 60000);//wait 1 minute bteween updating the DJ view.
    }
    */
    $("li").swipe("destroy");
    $("li").swipe({
      swipe:function(event, direction, distance, duration, fingerCount) {

        //console.log("You swiped " + direction );
        //console.log($(event.target).attr("sid"));
        Songs.update({_id:$(event.target).attr("sid")}, {$set:{status:"deleted"}});
      }
    });
  }
  function connectMeteor(){
    Meteor.reconnect();

  }

    Meteor.startup(function () {
  });

}

if (Meteor.isServer) {
    // code to run on server at startup
}
