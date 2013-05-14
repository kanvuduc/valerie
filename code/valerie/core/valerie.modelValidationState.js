﻿(function () {
    "use strict";
    var deferEvaluation = { "deferEvaluation": true },
    // Shortcuts.
        utils = valerie.utils,
        passedValidationResult = valerie.ValidationResult.passedInstance,
        pendingValidationResult = valerie.ValidationResult.pendingInstance,
        koObservable = ko.observable,
        koComputed = ko.computed,

    // Functions for computeds.
        failedFunction = function () {
            return this.result().failed;
        },
        failedStatesFunction = function () {
            var failedStates = [],
                validationStates = this.validationStates(),
                validationState,
                result,
                index;

            for (index = 0; index < validationStates.length; index++) {
                validationState = validationStates[index];

                if (validationState.settings.applicable()) {
                    result = validationState.result();

                    if (result.failed) {
                        failedStates.push(validationState);
                    }
                }
            }

            return failedStates;
        },
        messageFunction = function () {
            return this.result().message;
        },
        passedFunction = function () {
            return this.result().passed;
        },
        pendingFunction = function () {
            return this.result().pending;
        },
        pendingStatesFunction = function () {
            var pendingStates = [],
                validationStates = this.validationStates(),
                validationState,
                index;

            for (index = 0; index < validationStates.length; index++) {
                validationState = validationStates[index];

                if (validationState.result().pending) {
                    pendingStates.push(validationState);
                }
            }

            return pendingStates;
        },
        resultFunction = function () {
            if (this.failedStates().length > 0) {
                return valerie.ValidationResult.createFailedResult(this.settings.failureMessageFormat);
            }

            if (this.pendingStates().length > 0) {
                return pendingValidationResult;
            }

            return passedValidationResult;
        },
        touchedReadFunction = function () {
            var index,
                validationStates = this.validationStates();

            for (index = 0; index < validationStates.length; index++) {
                if (validationStates[index].touched()) {
                    return true;
                }
            }

            return false;
        },
        touchedWriteFunction = function (value) {
            var index,
                validationStates = this.validationStates();

            for (index = 0; index < validationStates.length; index++) {
                validationStates[index].touched(value);
            }
        };

    /**
     * An item in a model validation state summary.
     * @typedef valerie.ModelValidationState.summaryItem
     * @property {string} name the name of the property or sub-model which has failed validation
     * @property {string} message a message describing why validation failed
     */

    /**
     * Construction options for a model validation state.
     * @typedef valerie.ModelValidationState.options
     * @property {function} applicable the function used to determine if the model is applicable
     * @property {string} failureMessage the message shown when the model is in an invalid state
     * @property {function} name the function used to determine the name of the model; used in failure messages
     * @property {function} paused a value, observable or computed used to control whether the computation that updates
     * the result of this validation state is paused.
     */

    /**
     * The validation state for a model, which may comprise of simple properties and sub-models.
     * @param model the model the validation state is for
     * @param {valerie.ModelValidationState.options} [options = default options] the options to use when creating the
     * validation state
     * @constructor
     */
    valerie.ModelValidationState = function (model, options) {
        //noinspection JSValidateTypes
        options = utils.mergeOptions(valerie.ModelValidationState.defaultOptions, options);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.applicable = utils.asFunction(options.applicable);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.name = utils.asFunction(options.name);

        /**
         * Gets whether the model has failed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        this.failed = koComputed(failedFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to this model that are in a failure state.
         * @method
         * @return {IValidationState[]} the states that are in failure state
         */
        this.failedStates = koComputed(failedStatesFunction, this, deferEvaluation);

        /**
         * Gets a message describing the validation state.
         * @method
         * @return {string} the message, can be empty
         */
        this.message = koComputed(messageFunction, this, deferEvaluation);

        /**
         * The model this validation state is for.
         * @type {*}
         */
        this.model = model;

        /**
         * Gets whether the model has passed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        this.passed = koComputed(passedFunction, this, deferEvaluation);

        /**
         * Gets whether validation for the model hasn't yet completed.
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        this.pending = koComputed(pendingFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to this model where validation hasn't yet completed.
         * @method
         * @return {IValidationState[]} the states that are in pending state
         */
        this.pendingStates = koComputed(pendingStatesFunction, this, deferEvaluation);

        //noinspection JSUnresolvedVariable
        /**
         * Gets the result of the validation.
         * @method
         * @return {valerie.ValidationResult} the result
         */
        this.result = extras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);

        /**
         * Gets or sets whether the computation that updates the result of this validation state has been paused.
         * @param {boolean} [value] <code>true</code> if the computation should be paused, <code>false</code> if the
         * computation should not be paused
         * @return {boolean} <code>true</code> if the computation is paused, <code>false</code> otherwise
         */
        this.paused = this.result.paused;

        /**
         * Refreshes the result of this validation state.
         * @method
         */
        this.refresh = this.result.refresh;

        /**
         * The settings for this validation state.
         * @type {valerie.PropertyValidationState.options}
         */
        this.settings = options;

        /**
         * Gets a static summary of the validation states that belong to this model that are in failure state.
         * @method
         * @return {valerie.ModelValidationState.summaryItem[]} the summary
         */
        this.summary = koObservable([]);

        /**
         * Gets or sets whether the model has been "touched" by a user action.
         * @method
         * @param {boolean} [value] <code>true</code> if the model should marked as touched, <code>false</code> if
         * the model should be marked as untouched
         * @return {boolean} <code>true</code> if the model has been "touched", <code>false</code> otherwise
         */
        this.touched = koComputed({
            "read": touchedReadFunction,
            "write": touchedWriteFunction,
            "deferEvaluation": true,
            "owner": this
        });

        /**
         * Gets the validation states that belong to this model.
         * @method
         * @return {IValidationState[]} the validation states
         */
        this.validationStates = ko.observableArray();
    };

    valerie.ModelValidationState.prototype = {
        /**
         * Adds validation states to this validation state.
         * <br/><b>fluent</b>
         * @name valerie.ModelValidationState#addValidationStates
         * @fluent
         * @param {IValidationStates[]} validationStates the validation states to add
         * @return {valerie.ModelValidationState}
         */
        "addValidationStates": function (validationStates) {
            this.validationStates.push.apply(this.validationStates, validationStates);

            return this;
        },
        /**
         * Sets the value or function used to determine if the model is applicable.
         * <br/><b>fluent</b>
         * @name valerie.ModelValidationState#applicable
         * @fluent
         * @param {boolean|function} [valueOrFunction = true] the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "applicable": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.applicable = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Clears the static summary of validation states that are in a failure state.
         * <br/><b>fluent</b>
         * @name valerie.ModelValidationState#clearSummary
         * @fluent
         * @param {boolean} [clearSubModelSummaries = false] whether to clear the static summaries for sub-models that
         * belong to the model this validation state is for
         * @return {valerie.ModelValidationState}
         */
        "clearSummary": function (clearSubModelSummaries) {
            var states,
                state,
                index;

            this.summary([]);

            if (clearSubModelSummaries) {
                states = this.validationStates();

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    if (state.clearSummary) {
                        state.clearSummary();
                    }
                }
            }

            return this;
        },
        /**
         * Ends a chain of fluent method calls on a model validation state.<br/>
         * @fluent
         * @return {function} the model the validation state is for
         */
        "end": function () {
            return this.model;
        },
        /**
         * Sets the value or function used to determine the name of the model.
         * <br/><b>fluent</b>
         * @fluent
         * @param {string|function} valueOrFunction the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "name": function (valueOrFunction) {
            this.settings.name = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Removes validation states from this validation state.
         * <br/><b>fluent</b>
         * @fluent
         * @param {IValidationStates[]} validationStates the validation states to remove
         * @return {valerie.ModelValidationState}
         */
        "removeValidationStates": function (validationStates) {
            this.validationStates.removeAll(validationStates);

            return this;
        },
        /**
         * Stops validating the given sub-model by removing, from this validation state, the validation states that
         * belong to it.
         * @param {*} validatableSubModel the sub-model to stop validating
         * @return {valerie.ModelValidationState}
         */
        "stopValidatingSubModel": function (validatableSubModel) {
            this.validationStates.removeAll(validatableSubModel.validation().validationStates.peek());

            return this;
        },
        /**
         * Updates the static summary of validation states that are in a failure state.
         * <br/><b>fluent</b>
         * @fluent
         * @param {boolean} [updateSubModelSummaries = false] whether to update the static summaries for sub-models that
         * belong to the model this validation state is for
         * @return {valerie.ModelValidationState}
         */
        "updateSummary": function (updateSubModelSummaries) {
            var states = this.failedStates(),
                state,
                index,
                failures = [];

            for (index = 0; index < states.length; index++) {
                state = states[index];

                failures.push({
                    "name": state.settings.name(),
                    "message": state.message()
                });
            }

            this.summary(failures);

            if (updateSubModelSummaries) {
                states = this.validationStates();

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    if (state.updateSummary) {
                        state.updateSummary();
                    }
                }
            }

            return this;
        },
        /**
         * Adds the validation states for all the descendant properties and sub-models that belong to the model this
         * validation state is for.
         * <br/><b>fluent</b>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAll": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the descendant properties that belong to the model this validation state
         * is for.
         * <br/><b>fluent</b>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAllProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties that belong to the model this validation state is
         * for.
         * <br/><b>fluent</b>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, false);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties and sub-models that belong to the model this
         * validation state is for.
         * <br/><b>fluent</b>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildPropertiesAndSubModels": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, false);
            this.addValidationStates(validationStates);

            return this;
        }
    };

    /**
     * The default options used when constructing a property validation state.
     * @name valerie.ModelValidationState.defaultOptions
     * @lends valerie.ModelValidationState.options
     */
    valerie.ModelValidationState.defaultOptions = {
        "applicable": utils.asFunction(true),
        "failureMessageFormat": "",
        "name": utils.asFunction("(?)"),
        "paused": null
    };

    /**
     * Makes the passed-in model validatable. After invocation the model will have a validation state.
     * <br/><b>fluent</b>
     * @param {object|function} model the model to make validatable
     * @param {object} [options] the options to use when creating the model's validation state
     * @returns {valerie.ModelValidationState} the validation state belonging to the model
     */
    valerie.validatableModel = function (model, options) {
        var validationState = new valerie.ModelValidationState(model, options);

        valerie.validationState.setFor(model, validationState);

        return validationState;
    };
})();