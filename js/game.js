var game = {
    // terrible abuse of tweens
    delay: function(time, func) {
        new me.Tween(me.game.world)
            .delay(time)
            .onComplete(func)
            .start();
    },
    
    onload: function() {
        if (!me.video.init(game.width, game.height, {
            wrapper : "screen",
            // TODO check webgl compatibility
            renderer : me.video.CANVAS,
            scale : "auto",
            scaleMethod : "fit",
            doubleBuffering : true,
            useParentDOMSize: true,
        })) {
            alert("Your browser does not support HTML5 Canvas");
            return;
        }
        me.audio.init("ogg");
        me.loader.preload(game.resources, this.onloaded.bind(this))
    },

    onloaded: function() {
        me.state.set(me.state.PLAY, new game.PlayStage());
        me.state.set(me.state.USER, new game.PlayStage(true));
        me.state.change(me.state.USER);
    },

    playerData: {
        leivNumber : 50,
        foodNumber : 30,
        eatRate: 1, // how much food is eaten per leif
        stealRate: 2, //how much food per enemy on island is stolen in case of loss
    },

    width : 480,
    height: 270
}