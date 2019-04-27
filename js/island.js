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
        //Create Sliders
        let maxLeiv = game.playerData.leivNumber;
        let maxFood = this.numberFood;
        //this.leivSlider = new game.SOWIESO(0, maxLeiv)
        //this.foodSlider = new game.SOWIESO(0, maxFood)
        //this.foodSlider.connect(this.leivSrlider, this.exchangeRate)
        //this.addChild(this.leivSlider)
        //this.addChild(this.foodSlider)
        
        // #TODO: should be instance variables of Button
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
        
        //Slider for Leivs
        let maxLeiv = game.playerData.leivNumber
        let ratio = 1/(this.numberPeople + usrNumLeiv)
        
        //this.leivSlider = new game.SOWIESO(0, maxLeiv)
        //this.probSlider = new game.SOWIESO(0, 1)
        //this.probSlider.connect(this.leivSlider, ratio)
        //this.addChild(this.leivSlider)
        //this.addChild(this.probSlider)

        let usrNumLeiv = 80; //should be instance variable of button    
        console.log(this.fight(usrNumLeiv));  
    },

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