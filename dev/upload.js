const fs = require("fs-extra");
const globule = require("globule");
const rimraf = require("rimraf");
const path = require("path");
const exec = require("execute-command-sync");

const PATHS = {
	NO_GIT: "!git",
	ROOT: path.resolve(__dirname, ".."),
	DIST: path.resolve(__dirname, "..", "dist"),
	DIST_GP: path.resolve(__dirname, "..", "dist-gh"),
	DIST_GP_ALL: path.resolve(__dirname, "..", "dist-gh", "**/*"),
};
exec("npm run build", {cwd: PATHS.ROOT});

globule.find([PATHS.DIST_GP_ALL, PATHS.NO_GIT]).forEach((file, index) => {
	rimraf.sync(file);
});

fs.copySync(PATHS.DIST, PATHS.DIST_GP);

exec("git add .", {cwd: PATHS.DIST_GP});
exec("git commit", {cwd: PATHS.DIST_GP});
exec("git push origin gh-pages", {cwd: PATHS.DIST_GP});
