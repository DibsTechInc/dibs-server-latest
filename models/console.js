if (!process.env.NODE_ENV === 'production') require('dotenv').load();
const repl = require('repl');
const replHistory = require('repl.history');
const Promise = require('bluebird');
const models = require('./index');

const replServer = repl.start({
  prompt: 'dibs-models > ',
});
replHistory(replServer, `${process.env.HOME}/.model-history`);

replServer.context.models = models;
Object.keys(models).map(key => replServer.context[key] = models[key]);