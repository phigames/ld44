var game = {
    onload: function() {
        if (!me.video.init(480, 270, {
            wrapper : "screen",
            // TODO check webgl compatibility
            renderer : me.video.CANVAS,
            scale : 2,
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
        leivNumber : 100,
        foodNumber : 20,
        eatRate: 1, // how much food is eaten per leif
        stealRate: 1, //how much food per enemy on island is stolen in case of loss
    }
}