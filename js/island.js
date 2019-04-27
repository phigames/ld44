game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init");
    },

    start: function(onDone) { }
});


game.GoodIsland = game.Island.extend({
    init: function(difficulty) {
        this._super(game.Island, "init");        
        //#ToDO: Randomise
        this.exchangeRate = 1; //one Food per Leif
        //#ToDo: Randomise
        this.numberFood = 15;
        //var image = me.loader.getImage("island_placeholder");   
        //this.graphics = me.Sprite(200, 200,[
            //me.game.viewport.width / 2 - image.width / 2,
            //me.game.viewport.height - image.height - 20,
            //{ image : image }
        //] );
    },

    start: function(onDone) {
        //this.addChild(this.graphics);
        this.addChild(new game.GUI.Button(10, 10, 'böttn', onDone));
        //Create Sliders
        let maxLeiv = game.playerData.leivNumber;
        let maxFood = this.numberFood;
        this.leivSlider = new game.GUI.Slider(300,200, 200, 0, maxLeiv)
        this.foodSlider = new game.GUI.Slider(300,300, 200, 0, maxFood)
        this.foodSlider.connect(this.leivSlider, this.exchangeRate)
        this.addChild(this.leivSlider)
        this.addChild(this.foodSlider)
        
        // #TODO: should be instance variables of Button
        //let usrNumLeiv = 0;
        //let usrNumFood = 5;
        let usrNumLeiv = leivSlider.getValue
        let usrNumFood = foodSlider.getValue

        // update game.playerData
        game.playerData.leivNumber = game.playerData.leivNumber - usrNumLeiv;
        game.playerData.foodNumber = game.playerData.foodNumber - usrNumFood;
    
    },
});


game.BadIsland = game.Island.extend({
    init: function(difficulty){
        this._super(game.Island, "init");
        //#ToDo: Need to be randomised
        this.numberFood = 15;
        //#ToDo: Need to be randomised
        this.numberPeople = 20;

    },
    
    start: function(onDone) { 
        // 'enter button' added 
        this.addChild(new game.GUI.Button(10, 10, 'böttn', onDone));
        //let usrNumLeiv = 80; //#TODO: should be instance variable of button    
        //Slider for Leivs
        
        let maxLeiv = game.playerData.leivNumber;     
        this.leivSlider = new game.GUI.Slider(300,200,200,0, maxLeiv);
        this.probSlider = new game.GUI.Slider(300,300, 200, 0, 1);
        
        let usrNumLeiv = leivSlider.getValue;
        let ratio = 1/(this.numberPeople + usrNumLeiv);
        this.probSlider.connect(this.leivSlider, ratio);
        this.addChild(this.leivSlider);
        this.addChild(this.probSlider);

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