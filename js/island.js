game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init");
    },

    start: function(onDone) { }
});


game.GoodIsland = game.Island.extend({
    init: function(difficulty) {
        this._super(game.Island, "init");
        this.exchangeRate = 1;
    },

    start: function(onDone) {

        this.createSlide();
        // user sets number leivs & number of food
        // user gives accept statement
        let usrNumLeiv = 0;
        let usrNumFood = 5;

        // update game.playerData
        game.playerData.leivNumber = game.playerData.leivNumber - usrNumLeiv;
        game.playerData.foodNumber = game.playerData.foodNumber - usrNumFood;
    },

    createSlide: function(){

    },
});



game.BadIsland = game.Island.extend({
    init: function(difficulty){
        this._super(game.Island, "init");
        this.numberFood = 15;
        this.numberPeople = 50;
    },
    
    start: function(onDone) {
        


        onDone()
    },




});