# Minimal template for melonJS games

A minimal boilerplate template for game development with [melonJS](http://melonjs.org/), based on a simplified version of the [melonJS Boilerplate Project](https://github.com/melonjs/boilerplate), using a more recent version of melonJS and *without* boilerplate for [Tiled](https://www.mapeditor.org/).

## Getting started

Make sure you have these installed:

- [git](https://git-scm.com/) (version control)
- [npm (with Node.js)](https://www.npmjs.com/) (package manager for JavaScript/Node.js)
- [Grunt](https://gruntjs.com/) (tool for building the game): `npm install -g grunt-cli`

Follow these steps:

1. Clone or download this repository: `git clone https://github.com/phigames/melonjs-template.git`
2. In the cloned directory, install dependencies: `npm install`
3. To check if everything works, run the game: `grunt serve`, then open [localhost:8000](http://localhost:8000/) in a browser. The result should be a black canvas with an image in the top left corner

## What the files and directories are

Important files:

- `index.html`: main HTML document (include JavaScript files you create here, modify to your liking)
- `index.css`: main CSS stylesheet (modify to your liking)
- `js/`: where you put the JavaScript files for your game (remember to include them in `index.html`)
    - `js/game.js`: defines the global `game` object, entry point for your game
- `res/`: where you put your resources
    - `res/bgm/`: background music
    - `res/img/`: images
    - `res/sfx/`: sound effects
- `build/`: where your game will be built (publish these files; no need to modify)

Less impotant files:

- `lib/`: melonJS library and plugins
- `main.js`: entry point for [Electron](https://electronjs.org/), when you're building for desktop (no need to modify)
- `manifest.json`: project info for Electron (name, developer, app icon etc.; fill in or modify to your liking)
- `package.json`: project info for npm (name, dependencies; no need to modify)
- `node_modules`: where npm puts dependencies (ignore)
- `Gruntfile.js`: info about how Grunt will build your game (no need to modify)

## Testing and deploying

To test the game during development, keep `grunt serve` running. To build and publish, run `grunt`.

## Further information

- [melonJS Documentation](http://melonjs.github.io/melonJS/docs/)
- [Tutorial: Space Invaders](http://melonjs.github.io/tutorial-space-invaders/) (WARNING: based on an older version of melonJS and a different boilerplate project)

