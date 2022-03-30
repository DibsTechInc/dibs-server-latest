// const ErrorHelper = require('@dibs-tech/dibs-error-handler');
// import ErrorHelper from '../../lib/dibs-error-handler';
const ErrorHelper = require('../../lib/dibs-error-handler');

module.exports = function linkExperiment(sequelize, DataTypes) {
  const Experiment = sequelize.define(
    'experiment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: { type: DataTypes.TEXT },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      modular_base: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      paranoid: false,
    }
  );

  /*

  How this works:
  ---------------

  - Look up an experiment by id
  - Calculate the testValue provided mod experiment.modular_base
  - If the array has a function at index (testValue % experiment.modular_base) apply args to that function and return
  - Else apply args to control and return

  Possible improvements:
  - Ability to use different args by experiment

  */

  /**
   * @param {Object}          argument object with named parameters
   * @param {number}          argument.id the id of the experiment to perform
   * @param {string}          argument.name of the experiment, id will always take priority
   * @param {Array<any>}      argument.args the arguments to apply to the experiment functions
   * @param {number}          argument.testValue resolves the mod to test against the modular base to see
   *                                   whether we use the experimental function
   * @param {function}        argument.control function to use
   * @param {Array<function>} argument.experiments experimental functions
   * @param {function}        argument.filter if provided, will only call experiment function if it returns true
   * @returns {any} return value of the control function or any of the experiments
   */
  Experiment.performExperiment = async function performExperiment({ id, name, args = [], testValue, control, experiments, filter }) {
    try {
      let experiment;
      if (id) experiment = await this.findById(id);
      else if (name) experiment = await this.findOne({ where: { name } });
      if (!experiment) throw new Error('No such experiment');
      const testModBase = testValue % experiment.modular_base;
      const result = await (
        experiment.active
        && (!filter || filter())
        && experiments[testModBase] ? experiments[testModBase] : control
      )(...args);
      return result;
    } catch (err) {
      ErrorHelper.handleError({
        opsSubject: 'Experiment Error',
        opsIncludes: id ? `Experiment id: ${id}` : `Experiment name: ${name}`,
      })(err);
      return control(...args);
    }
  };

  return Experiment;
};
