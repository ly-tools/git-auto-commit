#!/usr/bin/env node

require('colors');
var program = require('commander');
var promise = require('promise');
var spawn = require('child_process').spawn;
var pkg = require('./package.json');
var CWD = process.cwd();

program.version(pkg.version)
	.option('-t, --time <n>', 'minutes between two commits', parseFloat)
	.parse(process.argv);

function run(command, args) {
  return new Promise(function(resolve, reject) {
    var task = spawn(command, args, {
    	cwd: CWD
    });
    task.on('close', function(code) {
      if (code !== 0) reject(new Error(command + ' process exited with code ' + code));
      else resolve();
    });
    task.stdout.pipe(process.stdout);
    task.stderr.pipe(process.stderr);
  });
}

function addAll() {
	return run('git', ['add', '--all']);
}

function commit() {
	return run('git', ['commit', '-m', '"[GIT AUTO COMMIT]: ' + new Date().toString() + '"']);
}

setInterval(function() {
	Promise.resolve().then(addAll).then(commit).then(function() {
		console.log(('[GIT AUTO COMMIT]: Commit success at ' + (new Date()).toString()).green);
	}).catch(function (e) {
		console.log(('[GIT AUTO COMMIT]: ' + e.message).red);
	});
}, (program.time || 5) * 60 * 1000);