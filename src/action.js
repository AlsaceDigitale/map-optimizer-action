const glob = require("glob");
const path = require("path");
const core = require('@actions/core');
const github = require('@actions/github');
const { isJsonTiledMap, optimizeMap } = require('map-optimizer');

(async function() {
    try {
        let mapFiles = [];
        const mapFile = core.getInput('map-file');
        if (mapFile) {
            mapFiles.push(mapFile);
        } else {
            // Let's scan the system for maps.
            mapFiles = glob.sync('**/*.json');
            mapFiles = mapFiles.filter(isJsonTiledMap);
        }

        for (let mapFile of mapFiles) {
            console.info(`start processing ${mapFile}`)
            let mapDir = path.dirname(mapFile);
            let outputDir = path.resolve(process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : '.', mapDir);
            await optimizeMap(mapFile, outputDir, 1, 0xffffff00);
            console.info(`done processing ${mapFile}`)
        }
    } catch (error) {
        console.error(error);
        core.setFailed(error.message);
    }
}());

