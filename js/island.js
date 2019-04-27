game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init");
    },

    start: function(onDone) { }
});


game.GoodIsland = game.Island.extend({
    init: function(difficulty) {
        this._super(game.Island, "init");
        this.exchangeRate = 1; // one Food per Leif
        this.numberFood = 15;
    },

    start: function(onDone) {

        this.addChild(new game.GUI.Button(10, 10, 'böttn', onDone));

        let maxLeiv = game.playerData.leivNumber;
        //Slider for Leivs
        //this.addChild(new game.SOWIESO, 0,maxLeiv)
        let maxFood = this.numberFood
        //Slider for Food
        //this.addChild(new game.SOWIESO, 0, maxFood)
        // user sets number leivs, number of food can be calculated via exchangeRate
        // user gives accept statement
        let usrNumLeiv = 0;
        let usrNumFood = 5;

        // update game.playerData
        game.playerData.leivNumber = game.playerData.leivNumber - usrNumLeiv;
        game.playerData.foodNumber = game.playerData.foodNumber - usrNumFood;
    
    },
});


game.BadIsland = game.Island.extend({
    init: function(difficulty){
        this._super(game.Island, "init");
        this.numberFood = 15;
        this.numberPeople = 20;

    },
    
    start: function(onDone) { 
        // 'enter button' added 
        this.addChild(new game.GUI.Button(10, 10, 'böttn', onDone));
        let maxLeiv = game.playerData.leivNumber
        //Slider for number of leivs
        //this.addChild(new game.SOWIESO,0, maxLeiv)

        //Slider for probability to win
        //this.addChild(new game.SOWIESO,0, 1)
        

        let usrNumLeiv = 80; //should be instance variable of button    
        console.log(this.fight(usrNumLeiv));  
    },

    // decide wether one wins or looses
    fight: function(usrNumLeiv){
        let sumPepople = this.numberPeople + usrNumLeiv;
        let pWinIsland = this.numberPeople/sumPepople;
        let randNumber = Math.random();
        //console.log(randNumber);
        let winningParty = 0;
        if (randNumber > pWinIsland){
            winningParty = 1;
        };
    
        game.playerData.leivNumber = game.playerData.leivNumber - usrNumLeiv;
        if (winningParty == 1){
            game.playerData.foodNumber = game.playerData.foodNumber + this.numberFood;
        };

    },


});