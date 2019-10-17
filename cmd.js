#!/usr/bin/env node

// Forked from eleventy v0.9.0

// This is a subtle fork for the main Elevent cmd.js to behave as a module, returning `elev` so it can be npm-required
// It allows things like:
//
//   let elev = require('./node_modules/\@visual-framework/vf-eleventy--extensions/11ty/cmd.js');
//   elev.write().then( function() {
//     console.log('Done building 11ty');
//     yourCallBack();
//   });

const pkg = require("./node_modules/\@11ty/eleventy/package.json");
const chalk = require("chalk"); // node 4+
require("please-upgrade-node")(pkg, {
  message: function(requiredVersion) {
    return chalk.red(
      `Eleventy requires Node ${requiredVersion}. You’ll need to upgrade to use it!`
    );
  }
});

if (process.env.DEBUG) {
  require("time-require");
}

const EleventyErrorHandler = require("./node_modules/\@11ty/eleventy/src/EleventyErrorHandler");

const argv = require("minimist")(process.argv.slice(2));
const Eleventy = require("./node_modules/\@11ty/eleventy/src/Eleventy");
const EleventyCommandCheck = require("./node_modules/\@11ty/eleventy/src/EleventyCommandCheck");
let elev = new Eleventy(argv.input, argv.output);

try {
  process.on("unhandledRejection", (error, promise) => {
    EleventyErrorHandler.error(promise, "Unhandled rejection in promise");
  });
  process.on("uncaughtException", e => {
    EleventyErrorHandler.fatal(e, "Uncaught exception");
  });
  process.on("rejectionHandled", promise => {
    EleventyErrorHandler.warn(
      promise,
      "A promise rejection was handled asynchronously"
    );
  });

  let cmdCheck = new EleventyCommandCheck(argv);
  cmdCheck.hasUnknownArguments();

  elev.setConfigPathOverride(argv.config);
  elev.setPathPrefix(argv.pathprefix);
  elev.setDryRun(argv.dryrun);
  elev.setPassthroughAll(argv.passthroughall);
  elev.setFormats(argv.formats);

  let isVerbose = process.env.DEBUG ? false : !argv.quiet;
  elev.setIsVerbose('*');


} catch (e) {
  EleventyErrorHandler.fatal(e, "Eleventy fatal error");
}

elev
  .init()
  .then( function() {
    if (argv.version) {
      console.log(elev.getVersion());
    } else if (argv.help) {
      console.log(elev.getHelp());
    } else if (argv.serve) {
      // Serve is instead run by the parent JS
      // elev.watch().then(function() {
      //   elev.serve(argv.port);
      // });
    } else if (argv.watch) {
      // Watch is instead run by the parent JS
      // elev.watch();
    } else {
      // No default
      // elev.write();
    }
  })
  .then(function() {
    // console.log('done in cmd');
  })
  .catch(EleventyErrorHandler.fatal);

module.exports = elev;
