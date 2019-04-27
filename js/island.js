game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init");
    },
    start: function(onDone) { }
});


game.GoodIsland = game.Island.extend({
    init: function(difficulty) {
        this._super(game.Island, "init");        
        this.exchangeRate = 1; //one Food per Leiv
        this.numberFood = 15;
        console.log("that is a good island");
        this.onDone = null;
        // Slider
        this.leivSlider = new game.GUI.Slider(300,200, 200, 0, game.playerData.leivNumber-1);
        this.foodSlider = new game.GUI.Slider(300,300, 200, 0, this.numberFood);
        this.foodSlider.connect(this.leivSlider, this.exchangeRate)

    },

    start: function(onDone) {
        this.onDone = onDone
        this.addChild(new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this)));
        this.addChild(this.leivSlider);
        this.addChild(this.foodSlider);        
    },

    onclickButt: function(){
        let usrNumLeiv = this.leivSlider.getValue();
        let usrNumFood = this.foodSlider.getValue();
        game.playerData.leivNumber = game.playerData.leivNumber - usrNumLeiv;
        game.playerData.foodNumber = game.playerData.foodNumber - usrNumFood;
        this.onDone()
    }
});


game.BadIsland = game.Island.extend({
    init: function(difficulty){
        this._super(game.Island, "init");
        this.numberFood = 15;
        this.numberPeople = 20;
        console.log('this is a bad island');
        this.onDone = null;
        //Slider
        this.leivSlider = new game.GUI.Slider(300,200,200,0, game.playerData.leivNumber-1);
        this.probSlider = new game.GUI.Slider(300,300, 200, 0, 1);
        let ratio = 1/(this.numberPeople + game.playerData.leivNumber);
        this.probSlider.connect(this.leivSlider, ratio);
    },
    
    start: function(onDone) { 
        // 'enter button' added 
        this.onDone = onDone;
        this.addChild(new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this)));
        this.addChild(this.leivSlider);
        this.addChild(this.probSlider);
    },

    onclickButt: function(){
        this.fight()
        this.onDone()
    },

    fight: function(){
        let usrNumLeiv = this.leivSlider.getValue();
        let pWinIsland = this.numberPeople/(this.numberPeople + usrNumLeiv);
        let randNumber = Math.random();
        let winningParty = 0;
        if (randNumber > pWinIsland){
            winningParty = 1;
            console.log("you have won the fight");
        };
        game.playerData.leivNumber = game.playerData.leivNumber - usrNumLeiv;
        if (winningParty == 1){
            game.playerData.foodNumber = game.playerData.foodNumber + this.numberFood;
        };

    },


});

        //var image = me.loader.getImage("island_placeholder");   
        //this.graphics = me.Sprite(200, 200,[
            //me.game.viewport.width / 2 - image.width / 2,
            //me.game.viewport.height - image.height - 20,
            //{ image : image }
        //] );