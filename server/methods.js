Meteor.methods({
	placeBet:function(userId, questionId, choiceIndex, value){
    		
		if (typeof (question=Questions.findOne({"_id": questionId, "bets.user":userId}))=='undefined'){
			//item = Questions.insert({title:'Foo'};
			Questions.update(questionId, {$push: {'bets':{user:userId, choiceIndex:choiceIndex, value:value }}});
			return "not found";

		}else{   			
	    	Questions.update({"_id": questionId, "bets.user":userId}, {$set:{ 'bets.$.choiceIndex':choiceIndex, 'bets.$.value':value}});
	      	return "update";
		}


	},

	setQuestionOutcome:function(questionId, choiceIndex){
		Questions.update(questionId, {$set:{outcomeIndex:choiceIndex}});
    	return "set choiceIndex: " + choiceIndex;


	},

	getScores:function(){
    		
		


	}		





});