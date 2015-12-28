var _ = require('lodash');
var async = require('async-chainable');
var asyncExec = require('async-chainable-exec');
var colors = require('colors');
var fs = require('fs');
var which = require('which');

module.exports = {
	name: 'mongodb',
	description: 'Backup all MongoDB databases',
	backup: function(finish, workspace) {
		async()
			.use(asyncExec)
			.then(function(next) {
				// Sanity checks {{{
				if (!mindstate.config.mongodb.enabled) {
					if (mindstate.verbose) console.log(colors.blue('[MongoDB]'), 'MongoDB backup is disabled');
					return next('SKIP');
				}
				next();
				// }}}
			})
			.then('binPath', function(next) {
				// Check for binary {{{
				which('mongodump', function(err) {
					if (err) {
						if (mindstate.verbose) console.log(colors.blue('[MongoDB]'), '`mongodump` is not in PATH');
						return next('SKIP');
					}
					next();
				});
				// }}}
			})
			.then(function(next) {
				if (mindstate.verbose) console.log(colors.blue('[MongoDB]'), 'Run', mindstate.config.mongodb.command);
				next();
			})
			.exec(mindstate.config.mongodb.command)
			.end(finish);
	},
	config: function(finish) {
		return finish(null, {
			mongodb: {
				enabled: true,
				command: 'mongodump -o {{tempDir}}/mongodb',
			},
		});
	},
};
