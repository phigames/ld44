game.Island = me.Container.extend({
    init: function(difficulty) { 
    },

    start: function(onDone) { }
});


game.GoodIsland = Island.extend({
    init: function(difficulty) {
        this.exchangeRate
        },

    start: function(onDone) {

        this.createSlide()
        // user sets number leivs & number of food
        // user gives accept statement
        let usrNumLeiv = 0;
        let usrNumFood = 5;

        // update game.playerData
        game.playerData.leivNumber = game.playerData.leivNumber - usrNumLeiv;
        game.playerData.foodNumber = game.playerData.foodNumber - usrNumFood;
        onDone()
    },

    createSlide: function(){

    },
});



game.GoodIsland = Island.extend({
    init: function(difficulty){
        this.numberFood = 15;
        this.numberPeople = 50;
    },
    
    start: function(onDone) {
        


        onDone()
    },




});