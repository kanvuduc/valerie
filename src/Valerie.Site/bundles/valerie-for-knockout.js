﻿///#source 1 1 ../valerie/core/valerie.validationResult.js
// valerie.validationResult
// - defines the ValidationResult constructor function
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var states = {
        "failed": {},
        "passed": {},
        "pending": {}
    },
        // ReSharper disable InconsistentNaming
        ValidationResult;
    // ReSharper restore InconsistentNaming

    // + ValidationResult
    // - the result of a validation test
    ValidationResult = valerie.ValidationResult = function (state, message) {
        this.state = state;

        this.failed = state === states.failed;
        this.passed = state === states.passed;
        this.pending = state === states.pending;

        this.message = message;
    };

    valerie.ValidationResult.states = states;

    // + FailedValidationResult
    // - a failed result for a validation test
    valerie.FailedValidationResult = function (message) {
        return new ValidationResult(states.failed, message);
    };

    // + PassedValidationResult
    // - a passed result for a validation test
    valerie.PassedValidationResult = function (message) {
        return new ValidationResult(states.passed, message);
    };

    // + PendingValidationResult
    // - a pending result for a validation test
    valerie.PendingValidationResult = function (message) {
        return new ValidationResult(states.pending, message);
    };

    valerie.ValidationResult.passed = new ValidationResult(states.passed, "");
    
    valerie.ValidationResult.pending = new ValidationResult(states.pending, "");
})();

///#source 1 1 ../valerie/core/valerie.utils.js
// valerie.utils
// - general purpose utilities
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
/*jshint eqnull: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var utils = valerie.utils = valerie.utils || {};

    // + utils.asFunction
    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    // + utils.isArray
    utils.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };

    // + utils.isArrayOrObject
    utils.isArrayOrObject = function (value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

    // + utils.isFunction
    utils.isFunction = function (value) {
        if (value == null) {
            return false;
        }

        return (typeof value === "function");
    };

    // + utils.isMissing
    utils.isMissing = function (value) {
        if (value == null) {
            return true;
        }

        if (value.length === 0) {
            return true;
        }

        return false;
    };

    // + utils.isObject
    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }

        if (utils.isArray(value)) {
            return false;
        }

        return typeof value === "object";
    };

    // + utils.isString
    utils.isString = function (value) {
        return {}.toString.call(value) === "[object String]";
    };
    
    // + utils.mergeOptions
    utils.mergeOptions = function (defaultOptions, options) {
        var mergedOptions = {},
            name,
            value;

        if (defaultOptions == null) {
            defaultOptions = {};
        }

        if (options == null) {
            options = {};
        }

        for (name in defaultOptions) {
            if (defaultOptions.hasOwnProperty(name)) {
                value = defaultOptions[name];
                
                if (utils.isArray(value)) {
                    value = value.slice(0);
                }

                mergedOptions[name] = value;
            }
        }

        for (name in options) {
            if (options.hasOwnProperty(name)) {
                mergedOptions[name] = options[name];
            }
        }

        return mergedOptions;
    };
})();

///#source 1 1 ../valerie/core/valerie.formatting.js
// valerie.formatting
// - general purpose formatting functions
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*jshint eqnull: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var formatting = valerie.formatting = valerie.formatting || {};

    // + formatting.addThousandsSeparator
    formatting.addThousandsSeparator = function (numberString, thousandsSeparator, decimalSeparator) {
        var wholeAndFractionalParts = numberString.toString().split(decimalSeparator),
            wholePart = wholeAndFractionalParts[0];

        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        wholeAndFractionalParts[0] = wholePart;

        return wholeAndFractionalParts.join(decimalSeparator);
    };

    // + format.replacePlaceholders
    formatting.replacePlaceholders = function (format, replacements) {
        if (replacements == null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement == null) {
                return match;
            }

            return replacement.toString();
        });
    };
})();

///#source 1 1 ../valerie/core/valerie.passThroughConverter.js
// valerie.passThroughConverter
// - the pass through converter
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*jshint eqnull: true */
/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

    // + converters.passThrough
    converters.passThrough = {
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            return value;
        }
    };
})();

///#source 1 1 ../valerie/core/valerie.knockout.extras.js
// valerie.knockout.extras
// - extra functionality for KnockoutJS
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../../frameworks/knockout-2.2.1.debug.js"/>

/*jshint eqnull: true */
/*global ko: false, valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var knockout = valerie.knockout = valerie.knockout || {},
        extras = knockout.extras = knockout.extras || {};

    // + isolatedBindingHandler factory function
    // - creates a binding handler in which update is called only when a dependency changes and not when another
    //   binding changes
    extras.isolatedBindingHandler = function (initOrUpdateFunction, updateFunction) {
        var initFunction = (arguments.length === 1) ? function () {
        } : initOrUpdateFunction;
        
        updateFunction = (arguments.length === 2) ? updateFunction : initOrUpdateFunction;

        return {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                initFunction(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

                ko.computed({
                    "read": function () {
                        updateFunction(element, valueAccessor, allBindingsAccessor, viewModel,
                            bindingContext);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            }
        };
    };

    // + pausableComputed factory function
    // - creates a computed whose evaluation can be paused and unpaused
    extras.pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options,
        pausedValueOrObservableOrComputed) {

        var lastValue,
            paused,
            computed;

        if (pausedValueOrObservableOrComputed == null) {
            paused = ko.observable(false);
        } else {
            paused = ko.utils.isSubscribable(pausedValueOrObservableOrComputed) ?
                pausedValueOrObservableOrComputed :
                ko.observable(pausedValueOrObservableOrComputed);
        }

        computed = ko.computed(function () {
            if (paused()) {
                return lastValue;
            }

            return evaluatorFunction.call(evaluatorFunctionTarget);
        }, evaluatorFunctionTarget, options);

        computed.paused = ko.computed({
            "read": function () {
                return paused();
            },
            "write": function (value) {
                if (value) {
                    value = true;
                }

                if (value === paused()) {
                    return;
                }

                if (value) {
                    lastValue = computed();
                }

                paused(value);
            }
        });

        computed.refresh = function () {
            if (!paused()) {
                return;
            }

            paused(false);
            lastValue = computed();
            paused(true);
        };

        return computed;
    };
})();

///#source 1 1 ../valerie/core/valerie.dom.js
// valerie.dom
// - utilities for working with the document object model
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*jshint eqnull: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var dom = valerie.dom = valerie.dom || {},
        classNamesSeparatorExpression = /\s+/g,
        trimWhitespaceExpression = /^\s+|\s+$/g;

    // + dom.classNamesStringToDictionary
    dom.classNamesStringToDictionary = function (classNames) {
        var array,
            dictionary = {},
            index;

        if (classNames == null) {
            return dictionary;
        }

        classNames = classNames.replace(trimWhitespaceExpression, "");

        array = classNames.split(classNamesSeparatorExpression);

        for (index = 0; index < array.length; index++) {
            dictionary[array[index]] = true;
        }

        return dictionary;
    };

    // + dom.classNamesDictionaryToString
    dom.classNamesDictionaryToString = function (dictionary) {
        var name,
            array = [];

        for (name in dictionary) {
            if (dictionary.hasOwnProperty(name)) {
                if (dictionary[name]) {
                    array.push(name);
                }
            }
        }

        array.sort();

        return array.join(" ");
    };

    // + setElementVisibility
    // - sets the visibility of the given DOM element
    dom.setElementVisibility = function (element, newVisibility) {
        var currentVisibility = (element.style.display !== "none");
        if (currentVisibility === newVisibility) {
            return;
        }

        element.style.display = (newVisibility) ? "" : "none";
    };
})();

///#source 1 1 ../valerie/core/valerie.knockout.js
// valerie.knockout
// - the class and functions that validate a view-model constructed using knockout observables and computeds
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.validationResult.js"/>
/// <reference path="valerie.passThroughConverter.js"/>
/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.formatting.js"/> 
/// <reference path="valerie.extras.js"/>

/*jshint eqnull: true */
/*global ko: false, valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var FailedValidationResult = valerie.FailedValidationResult,
        // ReSharper restore InconsistentNaming
        passedValidationResult = valerie.ValidationResult.passed,
        pendingValidationResult = valerie.ValidationResult.pending,
        koObservable = ko.observable,
        koComputed = ko.computed,
        utils = valerie.utils,
        formatting = valerie.formatting,
        knockout = valerie.knockout,
        extras = knockout.extras,
        deferEvaluation = { "deferEvaluation": true },
        getValidationStateMethodName = "validation",
        definition;

    // + findValidationStates
    // - finds and returns the validation states of:
    //   - properties for the given model
    //   - sub-models of the given model, if permitted
    //   - descendant properties and sub-models of the given model, if requested
    knockout.findValidationStates = function (model, includeSubModels, recurse, validationStates) {

        if (!(1 in arguments)) {
            includeSubModels = true;
        }

        if (!(2 in arguments)) {
            recurse = false;
        }

        if (!(3 in arguments)) {
            validationStates = [];
        }

        var name,
            validationState,
            value;

        for (name in model) {
            if (model.hasOwnProperty(name)) {
                value = model[name];

                if (value == null) {
                    continue;
                }

                validationState = knockout.getValidationState(value);

                if (ko.isObservable(value)) {
                    value = value.peek();
                }

                if (utils.isFunction(value)) {
                    continue;
                }

                if (utils.isArrayOrObject(value)) {
                    if (includeSubModels && validationState) {
                        validationStates.push(validationState);
                    }

                    if (recurse) {
                        knockout.findValidationStates(value, includeSubModels, true, validationStates);
                    }
                } else {
                    if (validationState) {
                        validationStates.push(validationState);
                    }
                }
            }
        }

        return validationStates;
    };

    // + getValidationState
    // - gets the validation state from a model, observable or computed
    // - for use when developing bindings
    knockout.getValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return null;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return null;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    // + hasValidationState
    // - determines if the given model, observable or computed has a validation state
    // - for use when developing bindings
    knockout.hasValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return false;
        }

        return modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName);
    };

    // + setValidationState
    // - sets the validation state on the model, observable or computed
    // - for use when configuring validation in a non-fluent manner
    knockout.setValidationState = function (modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[getValidationStateMethodName] = function () {
            return state;
        };
    };

    // + validatableModel
    // - makes the model passed in validatable
    knockout.validatableModel = function (model, options) {
        var validationState = new knockout.ModelValidationState(model, options);

        knockout.setValidationState(model, validationState);

        // Return the validation state so it can be used in a fluent manner.
        return validationState;
    };

    // + validatableProperty
    // - makes the observable, observable array or computed passed in validatable
    knockout.validatableProperty = function (observableOrComputed, options) {
        if (!ko.isSubscribable(observableOrComputed)) {
            throw "Only observables or computeds can be made validatable properties.";
        }

        var validationState = new knockout.PropertyValidationState(observableOrComputed, options);

        knockout.setValidationState(observableOrComputed, validationState);

        // Return the validation state so it can be used in a fluent manner.
        return validationState;
    };

    // + validate extension function
    // - creates and returns the validation state for an observable or computed
    koObservable.fn.validate = koComputed.fn.validate = function (validationOptions) {

        // Create the validation state, then return it, so it can be modified fluently.
        return knockout.validatableProperty(this, validationOptions);
    };

    // + ModelValidationState
    // - validation state for a model
    // - the model may comprise of simple or complex properties
    (function () {
        // Functions for computeds.
        var failedFunction = function () {
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
                    return new FailedValidationResult(this.settings.failureMessageFormat);
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

        definition = knockout.ModelValidationState = function (model, options) {
            options = utils.mergeOptions(knockout.ModelValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);

            this.model = model;
            this.settings = options;
            this.summary = koObservable([]);
            this.validationStates = ko.observableArray();

            // Computeds.
            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.failedStates = koComputed(failedStatesFunction, this, deferEvaluation);
            this.message = koComputed(messageFunction, this, deferEvaluation);
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.pending = koComputed(pendingFunction, this, deferEvaluation);
            this.pendingStates = koComputed(pendingStatesFunction, this, deferEvaluation);
            this.result = extras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);
            this.touched = koComputed({
                "read": touchedReadFunction,
                "write": touchedWriteFunction,
                "deferEvaluation": true,
                "owner": this
            });

            this.paused = this.result.paused;
            this.refresh = this.result.refresh;
        };

        definition.prototype = {
            // Validation state methods support a fluent interface.
            "addValidationStates": function (validationStates) {
                this.validationStates.push.apply(this.validationStates, validationStates);

                return this;
            },
            "applicable": function (valueOrFunction) {
                if (valueOrFunction == null) {
                    valueOrFunction = true;
                }

                this.settings.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
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
            "name": function (valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "end": function () {
                return this.model;
            },
            "removeValidationStates": function (validationStates) {
                this.validationStates.removeAll(validationStates);

                return this;
            },
            "stopValidatingSubModel": function (validatableSubModel) {
                this.validationStates.removeAll(validatableSubModel.validation().validationStates.peek());

                return this;
            },
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
            "validateAll": function () {
                var validationStates = knockout.findValidationStates(this.model, true, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateAllProperties": function () {
                var validationStates = knockout.findValidationStates(this.model, false, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyProperties": function () {
                var validationStates = knockout.findValidationStates(this.model, false, false);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyPropertiesAndSubModels": function () {
                var validationStates = knockout.findValidationStates(this.model, true, false);
                this.addValidationStates(validationStates);

                return this;
            }
        };

        definition.defaultOptions = {
            "applicable": utils.asFunction(true),
            "failureMessageFormat": "",
            "name": utils.asFunction("(?)"),
            "paused": null
        };
    })();

    // + PropertyValidationState
    // - validation state for a single, simple, observable or computed property
    (function () {
        var missingFunction = function () {
            var value = this.observableOrComputed(),
                missing = this.settings.missingTest(value),
                required = this.settings.required();

            if (missing && required) {
                return -1;
            }

            if (missing && !required) {
                return 0;
            }

            return 1;
        },
            rulesResultFunction = function () {
                var value = this.observableOrComputed(),
                    rules = this.settings.rules,
                    rule,
                    result,
                    index;

                for (index = 0; index < rules.length; index++) {
                    rule = rules[index];

                    result = rule.test(value);

                    if (result.failed || result.pending) {
                        return result;
                    }
                }

                return passedValidationResult;
            },
            // Functions for computeds.
            failedFunction = function () {
                return this.result().failed;
            },
            messageFunction = function () {
                var message = this.result().message;

                message = formatting.replacePlaceholders(message, { "name": this.settings.name() });

                return message;
            },
            passedFunction = function () {
                return this.result().passed;
            },
            pendingFunction = function () {
                return this.result().pending;
            },
            resultFunction = function () {
                var missingResult,
                    result;

                result = this.boundEntry.result();
                if (result.failed) {
                    return result;
                }

                missingResult = missingFunction.apply(this);

                if (missingResult === -1) {
                    return new FailedValidationResult(this.settings.missingFailureMessage);
                }

                if (missingResult === 0) {
                    return result;
                }

                return rulesResultFunction.apply(this);
            },
            showMessageFunction = function () {
                if (!this.settings.applicable()) {
                    return false;
                }

                return this.touched() && this.result().failed;
            };

        // Constructor Function
        definition = knockout.PropertyValidationState = function (observableOrComputed, options) {
            options = utils.mergeOptions(knockout.PropertyValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);
            options.required = utils.asFunction(options.required);

            this.boundEntry = {
                "focused": koObservable(false),
                "result": koObservable(passedValidationResult),
                "textualInput": false
            };

            this.observableOrComputed = observableOrComputed;
            this.settings = options;
            this.touched = koObservable(false);

            // Computeds.
            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.message = extras.pausableComputed(messageFunction, this, deferEvaluation);
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.pending = koComputed(pendingFunction, this, deferEvaluation);
            this.result = koComputed(resultFunction, this, deferEvaluation);
            this.showMessage = extras.pausableComputed(showMessageFunction, this, deferEvaluation);
        };

        definition.prototype = {
            // Validation state methods support a fluent interface.
            "addRule": function (rule) {
                this.settings.rules.push(rule);

                return this;
            },
            "applicable": function (valueOrFunction) {
                if (valueOrFunction == null) {
                    valueOrFunction = true;
                }

                this.settings.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "end": function () {
                var index,
                    settings = this.settings,
                    valueFormat = settings.valueFormat,
                    valueFormatter = settings.converter.formatter,
                    rules = settings.rules,
                    ruleSettings;

                for (index = 0; index < rules.length; index++) {
                    ruleSettings = rules[index].settings;

                    ruleSettings.valueFormat = valueFormat;
                    ruleSettings.valueFormatter = valueFormatter;
                }

                return this.observableOrComputed;
            },
            "name": function (valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "required": function (valueOrFunction) {
                if (valueOrFunction == null) {
                    valueOrFunction = true;
                }

                this.settings.required = utils.asFunction(valueOrFunction);

                return this;
            },
            "valueFormat": function (format) {
                this.settings.valueFormat = format;

                return this;
            }
        };

        // Define default options.
        definition.defaultOptions = {
            "applicable": utils.asFunction(true),
            "converter": valerie.converters.passThrough,
            "entryFormat": null,
            "invalidEntryFailureMessage": "",
            "missingFailureMessage": "",
            "missingTest": utils.isMissing,
            "name": utils.asFunction(),
            "required": utils.asFunction(false),
            "rules": [],
            "valueFormat": null
        };
    })();
})();

///#source 1 1 ../valerie/core/valerie.knockout.bindings.js
// valerie.knockout.bindings
// - knockout bindings for:
//   - validating user entries
//   - showing the validation state of a view-model
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.validationResult.js"/>
/// <reference path="valerie.utils.js"/>
/// <reference path="valerie.dom.js"/>
/// <reference path="valerie.knockout.extras.js"/>
/// <reference path="valerie.knockout.js"/>
/// <reference path="valerie.passThrough.js"/>

/*jshint eqnull: true */
/*global ko: false, valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var FailedValidationResult = valerie.FailedValidationResult,
        // ReSharper restore InconsistentNaming
        passedValidationResult = valerie.ValidationResult.passed,
        utils = valerie.utils,
        dom = valerie.dom,
        knockout = valerie.knockout,
        converters = valerie.converters,
        koBindingHandlers = ko.bindingHandlers,
        koRegisterEventHandler = ko.utils.registerEventHandler,
        setElementVisibility = dom.setElementVisibility,
        getValidationState = knockout.getValidationState,
        isolatedBindingHandler = valerie.knockout.extras.isolatedBindingHandler;

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var checkedBindingHandler = koBindingHandlers.checked,
            valueBindingHandler = koBindingHandlers.value,
            validatedCheckedBindingHandler,
            validatedValueBindingHandler,
            blurHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed);

                validationState.touched(true);
                validationState.boundEntry.focused(false);
                validationState.message.paused(false);
                validationState.showMessage.paused(false);
            },
            textualInputBlurHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed),
                    value;

                if (validationState.boundEntry.result.peek().failed) {
                    return;
                }

                value = observableOrComputed.peek();
                element.value = validationState.settings.converter.formatter(value,
                    validationState.settings.entryFormat);
            },
            textualInputFocusHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed);

                validationState.boundEntry.focused(true);
                validationState.message.paused(true);
                validationState.showMessage.paused(true);
            },
            textualInputKeyUpHandler = function (element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = getValidationState(observableOrComputed),
                    settings = validationState.settings;

                if (enteredValue.length === 0 && settings.required()) {
                    observableOrComputed(null);

                    validationState.boundEntry.result(new FailedValidationResult(settings.missingFailureMessage));

                    return;
                }

                parsedValue = settings.converter.parser(enteredValue);
                observableOrComputed(parsedValue);

                if (parsedValue == null) {
                    validationState.boundEntry.result(new FailedValidationResult(settings.invalidEntryFailureMessage));

                    return;
                }

                validationState.boundEntry.result(passedValidationResult);
            },
            textualInputUpdateFunction = function (observableOrComputed, validationState, element) {
                // Get the value so this function becomes dependent on the observable or computed.
                var value = observableOrComputed();

                // Prevent a focused element from being updated by the model.
                if (validationState.boundEntry.focused.peek()) {
                    return;
                }

                validationState.boundEntry.result(passedValidationResult);

                element.value = validationState.settings.converter.formatter(value,
                    validationState.settings.entryFormat);
            };

        // + validatedChecked binding handler
        // - functions in the same way as the "checked" binding handler
        // - registers a blur event handler so validation messages for missing selections can be displayed
        validatedCheckedBindingHandler = koBindingHandlers.validatedChecked = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed);

                checkedBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);

                if (validationState) {
                    koRegisterEventHandler(element, "blur", function () {
                        blurHandler(element, observableOrComputed);
                    });

                    // Use the name of the bound element if a property name has not been specified.
                    if (validationState.settings.name() == null) {
                        validationState.settings.name = utils.asFunction(element.name);
                    }
                }
            },
            "update": checkedBindingHandler.update
        };

        // + validatedValue binding handler
        // - with the exception of textual inputs, functions in the same way as the "value" binding handler
        // - registers a blur event handler so validation messages for completed entries or selections can be displayed
        // - registers a blur event handler to reformat parsed textual entries
        validatedValueBindingHandler = koBindingHandlers.validatedValue = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed),
                    tagName,
                    textualInput;

                if (!validationState) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                if (validationState.settings.name() == null) {
                    validationState.settings.name = utils.asFunction(element.name);
                }

                koRegisterEventHandler(element, "blur", function () {
                    blurHandler(element, observableOrComputed);
                });

                tagName = ko.utils.tagNameLower(element),
                textualInput = (tagName === "input" && element.type.toLowerCase() === "text") || tagName === "textarea";

                if (!textualInput) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                validationState.boundEntry.textualInput = true;

                koRegisterEventHandler(element, "blur", function () {
                    textualInputBlurHandler(element, observableOrComputed);
                });

                koRegisterEventHandler(element, "focus", function () {
                    textualInputFocusHandler(element, observableOrComputed);
                });

                koRegisterEventHandler(element, "keyup", function () {
                    textualInputKeyUpHandler(element, observableOrComputed);
                });

                // Rather than update the textual input in the "update" method we use a computed to ensure the textual
                // input's value is changed only when the observable or computed is changed, not when another binding is
                // changed.
                ko.computed({
                    "read": function () {
                        textualInputUpdateFunction(observableOrComputed, validationState, element);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            },
            "update": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed);

                if (validationState && validationState.boundEntry.textualInput) {
                    return;
                }

                valueBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);
            }
        };

        // + originalBindingHandlers
        // - record the original binding handlers
        knockout.originalBindingHandlers = {
            "checked": checkedBindingHandler,
            "value": valueBindingHandler
        };

        // + validatingBindingHandlers
        // - the validating binding handlers
        knockout.validatingBindingHandlers = {
            "checked": validatedCheckedBindingHandler,
            "value": validatedValueBindingHandler
        };

        // + useValidatingBindingHandlers
        // - replaces the original "checked" and "value" binding handlers with validating equivalents
        knockout.useValidatingBindingHandlers = function () {
            koBindingHandlers.checked = validatedCheckedBindingHandler;
            koBindingHandlers.value = validatedValueBindingHandler;
            koBindingHandlers.koChecked = checkedBindingHandler;
            koBindingHandlers.koValue = valueBindingHandler;

            // Allow configuration changes to be made fluently.
            return knockout;
        };

        // + useOriginalBindingHandlers
        // - restores the original "checked" and "value" binding handlers
        knockout.useOriginalBindingHandlers = function () {
            koBindingHandlers.checked = checkedBindingHandler;
            koBindingHandlers.value = valueBindingHandler;

            // Allow configuration changes to be made fluently.
            return knockout;
        };
    })();

    (function () {
        var applyForValidationState =
            function (functionToApply, element, valueAccessor, allBindingsAccessor, viewModel) {
                var bindings = allBindingsAccessor(),
                    value = valueAccessor(),
                    validationState;

                if (value === true) {
                    value = bindings.value || bindings.checked ||
                        bindings.validatedValue || bindings.validatedChecked ||
                        viewModel;
                }

                validationState = getValidationState(value);

                if (validationState) {
                    functionToApply(validationState, value, bindings);
                }
            };

        // + disabledWhenNotValid binding handler
        koBindingHandlers.disabledWhenNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + disabledWhenTouchedAndNotValid binding handler
        koBindingHandlers.disabledWhenTouchedAndNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = validationState.touched() && !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + enabledWhenApplicable binding handler
        koBindingHandlers.enabledWhenApplicable = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.settings.applicable();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + formattedValue binding handler
        koBindingHandlers.formattedValue = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor) {
                var bindings = allBindingsAccessor(),
                    observableOrComputedOrValue = valueAccessor(),
                    value = ko.utils.unwrapObservable(observableOrComputedOrValue),
                    validationState = getValidationState(observableOrComputedOrValue),
                    formatter = converters.passThrough.formatter,
                    valueFormat;

                if (validationState) {
                    formatter = validationState.settings.converter.formatter;
                    valueFormat = validationState.settings.valueFormat;
                }

                formatter = bindings.formatter || formatter;
                if (valueFormat == null) {
                    valueFormat = bindings.valueFormat;
                }

                ko.utils.setTextContent(element, formatter(value, valueFormat));
            });

        // + validationCss binding handler
        // - sets CSS classes on the bound element depending on the validation status of the value:
        //   - error: if validation failed
        //   - focused: if the bound element is in focus
        //   - passed: if validation passed
        //   - touched: if the bound element has been touched
        //   - untouched: if the bound element has not been touched
        // - the names of the classes used are held in the bindingHandlers.validationCss.classNames object
        koBindingHandlers.validationCss = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    var classNames = koBindingHandlers.validationCss.classNames,
                        elementClassNames = element.className,
                        dictionary = dom.classNamesStringToDictionary(elementClassNames),
                        failed = validationState.failed(),
                        focused = false,
                        passed = validationState.passed(),
                        pending = validationState.pending(),
                        touched = validationState.touched(),
                        untouched = !touched;

                    if (validationState.boundEntry && validationState.boundEntry.focused()) {
                        focused = true;
                    }

                    dictionary[classNames.failed] = failed;
                    dictionary[classNames.focused] = focused;
                    dictionary[classNames.passed] = passed;
                    dictionary[classNames.pending] = pending;
                    dictionary[classNames.touched] = touched;
                    dictionary[classNames.untouched] = untouched;

                    element.className = dom.classNamesDictionaryToString(dictionary);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        koBindingHandlers.validationCss.classNames = {
            "failed": "error",
            "focused": "focused",
            "passed": "success",
            "pending": "waiting",
            "touched": "touched",
            "untouched": "untouched"
        };

        // + validationMessageFor binding handler
        // - makes the bound element visible if the value is invalid
        // - sets the text of the bound element to be the validation message
        koBindingHandlers.validationMessageFor = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.showMessage());
                    ko.utils.setTextContent(element, validationState.message());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenFocused binding handler
        // - makes the bound element visible if the bound element for the value is focused, invisible otherwise
        koBindingHandlers.visibleWhenFocused = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.focused());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenInvalid binding handler
        // - makes the bound element visible if the value is invalid, invisible otherwise
        koBindingHandlers.visibleWhenInvalid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.failed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenSummaryNotEmpty binding handler
        // - makes the bound element visible if the validation summary is not empty, invisible otherwise
        koBindingHandlers.visibleWhenSummaryNotEmpty = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.summary().length > 0);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenTouched binding handler
        // - makes the bound element visible if the value has been touched, invisible otherwise
        koBindingHandlers.visibleWhenTouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenUntouched binding handler
        // - makes the bound element visible if the value is untouched, invisible otherwise
        koBindingHandlers.visibleWhenUntouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, !validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenValid binding handler
        // - makes the bound element visible if the value is valid, invisible otherwise
        koBindingHandlers.visibleWhenValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.passed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });
    })();
})();

///#source 1 1 ../valerie/full/valerie.numericHelper.js
// valerie.numericHelper
// - helper for parsing and formatting numeric values
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.formatting.js"/>

/*jshint eqnull: true */
/*global valerie: true, boss:true */

var valerie = valerie || {};

(function () {
    "use strict";

    var formatting = valerie.formatting,
        formatStringAsOptions = function (numericHelper, format) {
            var includeCurrencySign = format.indexOf("C") > -1,
                includeThousandsSeparator = format.indexOf(",") > -1,
                decimalPlaceIndex = format.indexOf("."),
                numberOfDecimalPlaces = 0;

            if (decimalPlaceIndex === format.length - 1) {
                numberOfDecimalPlaces = null;
            } else {
                if (decimalPlaceIndex > -1) {
                    if (format.charAt(decimalPlaceIndex + 1) === "c") {
                        numberOfDecimalPlaces = numericHelper.settings.currencyMinorUnitPlaces;
                    } else {
                        numberOfDecimalPlaces = Number(format.substr(decimalPlaceIndex + 1));
                    }
                }
            }

            return {
                "includeCurrencySign": includeCurrencySign,
                "includeThousandsSeparator": includeThousandsSeparator,
                "numberOfDecimalPlaces": numberOfDecimalPlaces
            };
        };

    // + valerie.NumericHelper
    valerie.NumericHelper = function () {
    };

    valerie.NumericHelper.prototype = {
        "init": function (decimalSeparator, thousandsSeparator, currencySign, currencyMinorUnitPlaces) {
            var integerExpression = "\\d+(\\" + thousandsSeparator + "\\d{3})*",
                currencyMajorExpression = "(\\" + currencySign + ")?" + integerExpression,
                currentMajorMinorExpression = currencyMajorExpression + "(\\" +
                    decimalSeparator + "\\d{" + currencyMinorUnitPlaces + "})?",
                floatExpression = integerExpression + "(\\" + decimalSeparator + "\\d+)?";

            this.settings = {
                "decimalSeparator": decimalSeparator,
                "thousandsSeparator": thousandsSeparator,
                "currencySign": currencySign,
                "currencyMinorUnitPlaces": currencyMinorUnitPlaces
            };

            this.expressions = {
                "currencyMajor": new RegExp("^" + currencyMajorExpression + "$"),
                "currencyMajorMinor": new RegExp("^" + currentMajorMinorExpression + "$"),
                "float": new RegExp("^" + floatExpression + "$"),
                "integer": new RegExp("^" + integerExpression + "$")
            };

            return this;
        },
        "addThousandsSeparator": function (numericString) {
            var settings = this.settings;

            return formatting.addThousandsSeparator(numericString, settings.thousandsSeparator,
                settings.decimalSeparator);
        },
        "format": function (value, format) {
            if (value == null) {
                return "";
            }

            if (format == null) {
                format = "";
            }

            var settings = this.settings,
                formatOptions = formatStringAsOptions(this, format),
                numberOfDecimalPlaces = formatOptions.numberOfDecimalPlaces,
                negative = value < 0;

            if (negative) {
                value = -value;
            }

            if (numberOfDecimalPlaces != null) {
                value = value.toFixed(numberOfDecimalPlaces);
            } else {
                value = value.toString();
            }

            value = value.replace(".", settings.decimalSeparator);

            if (formatOptions.includeThousandsSeparator) {
                value = this.addThousandsSeparator(value);
            }

            return (negative ? "-" : "") +
                (formatOptions.includeCurrencySign ? settings.currencySign : "") +
                value;
        },
        "isCurrencyMajor": function (numericString) {
            return this.expressions.currencyMajor.test(numericString);
        },
        "isCurrencyMajorMinor": function (numericString) {
            return this.expressions.currencyMajorMinor.test(numericString);
        },
        "isFloat": function (numericString) {
            return this.expressions.float.test(numericString);
        },
        "isInteger": function (numericString) {
            return this.expressions.integer.test(numericString);
        },
        "parse": function (numericString) {
            numericString = this.unformat(numericString);

            return Number(numericString);
        },
        "unformat": function (numericString) {
            var settings = this.settings;

            numericString = numericString.replace(settings.currencySign, "");
            numericString = numericString.replace(settings.thousandsSeparator, "");
            numericString = numericString.replace(settings.decimalSeparator, ".");

            return numericString;
        }
    };
})();

///#source 1 1 ../valerie/full/valerie.converters.numeric.js
// valerie.converters.numeric
// - converters for numeric values
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.numericHelper.js"/>

/*jshint eqnull: true */
/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        defaultNumericHelper = new valerie.NumericHelper();

    // + converters.defaultNumericHelper
    converters.defaultNumericHelper = defaultNumericHelper;

    // + converters.currencyMajor
    converters.currencyMajor = {
        "formatter": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    // + converters.currencyMajorMinor
    converters.currencyMajorMinor = {
        "formatter": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajorMinor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    converters.currency = { "numericHelper": defaultNumericHelper };

    // + converters.float
    converters.float = {
        "formatter": function (value, format) {
            return converters.float.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.float.numericHelper;

            if (!numericHelper.isFloat(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    converters.float.numericHelper = defaultNumericHelper;

    // + converters.integer
    converters.integer = {
        "formatter": function (value, format) {
            return converters.integer.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.integer.numericHelper;

            if (!numericHelper.isInteger(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    converters.integer.numericHelper = defaultNumericHelper;

    // + converters.number
    converters.number = {
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            if (value == null) {
                return null;
            }

            value = Number(value);

            if (isNaN(value)) {
                return null;
            }

            return value;
        }
    };
})();

///#source 1 1 ../valerie/full/valerie.rules.js
// valerie.rules
// - general purpose rules
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.validationResult.js"/>
/// <reference path="../core/valerie.passThroughConverter.js"/>
/// <reference path="../core/valerie.utils.js"/>

/*jshint eqnull: true */
/*global valerie: false */

(function() {
    "use strict";

    // ReSharper disable InconsistentNaming
    var FailedValidationResult = valerie.FailedValidationResult,
        // ReSharper restore InconsistentNaming        
        passedValidationResult = valerie.ValidationResult.passed,
        rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils,
        formatting = valerie.formatting,
        emailExpression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    // + rules.ArrayLength
    rules.ArrayLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.ArrayLength.defaultOptions, options);

        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    rules.ArrayLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.During
    rules.During = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.During.defaultOptions, options);

        return new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    rules.During.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.Email
    rules.Email = function (options) {
        options = utils.mergeOptions(options);

        return new rules.Expression(emailExpression, options);
    };

    rules.Email.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };        
    
    // + rules.Expression
    rules.Expression = function(regularExpressionObjectOrString, options) {
        this.expression = utils.isString(regularExpressionObjectOrString) ?
            new RegExp(regularExpressionObjectOrString) :
            regularExpressionObjectOrString;

        this.settings = utils.mergeOptions(rules.Expression.defaultOptions, options);
    };

    rules.Expression.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Expression.prototype = {
        "test": function(value) {
            var failureMessage;

            if (value != null) {
                if (this.expression.test(value)) {
                    return passedValidationResult;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                this.settings.failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new FailedValidationResult(failureMessage);
        }
    };

    // + rules.Length
    rules.Length = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.Length.defaultOptions, options);

        var rangeRule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        this.test = function(value) {
            var length;

            if (value != null && value.hasOwnProperty("length")) {
                length = value.length;
            }

            // ReSharper disable UsageOfPossiblyUnassignedValue
            return rangeRule.test(length);
            // ReSharper restore UsageOfPossiblyUnassignedValue
        };
    };

    rules.Length.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.Matches
    rules.Matches = function(permittedValueOrFunction, options) {
        options = utils.mergeOptions(rules.Matches.defaultOptions, options);

        return new rules.OneOf([permittedValueOrFunction], options);
    };

    rules.Matches.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.NoneOf
    rules.NoneOf = function(forbiddenValuesOrFunction, options) {
        this.forbiddenValues = utils.asFunction(forbiddenValuesOrFunction);
        this.settings = utils.mergeOptions(rules.NoneOf.defaultOptions, options);
    };

    rules.NoneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.NoneOf.prototype = {
        "test": function(value) {
            var failureMessage,
                index,
                values = this.forbiddenValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    failureMessage = formatting.replacePlaceholders(
                        this.settings.failureMessageFormat, {
                            "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                        });

                    return new FailedValidationResult(failureMessage);
                }
            }

            return passedValidationResult;
        }
    };

    // + rules.Not
    rules.Not = function(forbiddenValueOrFunction, options) {
        options = utils.mergeOptions(rules.Not.defaultOptions, options);

        return new rules.NoneOf([forbiddenValueOrFunction], options);
    };

    rules.Not.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.OneOf
    rules.OneOf = function(permittedValuesOrFunction, options) {
        this.permittedValues = utils.asFunction(permittedValuesOrFunction);
        this.settings = utils.mergeOptions(rules.OneOf.defaultOptions, options);
    };

    rules.OneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.OneOf.prototype = {
        "test": function(value) {
            var failureMessage,
                index,
                values = this.permittedValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    return passedValidationResult;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                this.settings.failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new FailedValidationResult(failureMessage);
        }
    };

    // + rules.Range
    rules.Range = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "At least 2 arguments are expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.settings = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function(value) {
            var failureMessage,
                failureMessageFormat = this.settings.failureMessageFormat,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum != null,
                haveMinimum = minimum != null,
                haveValue = value != null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return passedValidationResult;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return passedValidationResult;
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "maximum": this.settings.valueFormatter(maximum, this.settings.valueFormat),
                    "minimum": this.settings.valueFormatter(minimum, this.settings.valueFormat),
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new FailedValidationResult(failureMessage);
        }
    };

    // + rules.StringLength
    rules.StringLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.StringLength.defaultOptions, options);

        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    rules.StringLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };
})();

///#source 1 1 ../valerie/full/valerie.knockout.fluent.converters.js
// valerie.knockout.fluent.converters
// - additional functions for the PropertyValidationState prototype for fluently specifying converters
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.utils.js"/>
/// <reference path="../core/valerie.knockout.js"/>
/// <reference path="valerie.converters.numeric.js"/>

/*jshint eqnull: true */
/*global ko: false, valerie: false */

(function () {
    "use strict";

    var utils = valerie.utils,
        converters = valerie.converters,
        prototype = valerie.knockout.PropertyValidationState.prototype;

    // + currencyMajor
    prototype.currencyMajor = function (options) {
        options = utils.mergeOptions(this.currencyMajor.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.currencyMajor;

        return this;
    };

    prototype.currencyMajor.defaultOptions = {
        "entryFormat": null,
        "valueFormat": "C,"
    };

    // + currencyMajorMinor
    prototype.currencyMajorMinor = function (options) {
        options = utils.mergeOptions(this.currencyMajorMinor.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.currencyMajorMinor;

        return this;
    };

    prototype.currencyMajorMinor.defaultOptions = {
        "entryFormat": ".c",
        "valueFormat": "C,.c"
    };

    // + float
    prototype.float = function (options) {
        options = utils.mergeOptions(this.float.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.float;

        return this;
    };

    prototype.float.defaultOptions = {
        "entryFormat": null,
        "valueFormat": ",."
    };

    // + integer
    prototype.integer = function (options) {
        options = utils.mergeOptions(this.integer.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.integer;

        return this;
    };

    prototype.integer.defaultOptions = {
        "entryFormat": null,
        "valueFormat": ","
    };

    // + number
    prototype.number = function () {
        this.settings.converter = converters.number;

        return this;
    };

    // + string
    prototype.string = function () {
        this.settings.converter = converters.passThrough;

        return this;
    };
})();

///#source 1 1 ../valerie/full/valerie.knockout.fluent.rules.js
// valerie.knockout.fluent.rules
// - additional functions for the PropertyValidationState prototype for fluently specifying rules
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.knockout.js"/>
/// <reference path="valerie.rules.js"/>

/*jshint eqnull: true */
/*global ko: false, valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var prototype = valerie.knockout.PropertyValidationState.prototype,
        rules = valerie.rules;

    // + during
    prototype.during = function (earliestValueOrFunction, latestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, latestValueOrFunction, options));
    };

    // + earliest
    prototype.earliest = function (earliestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, null, options));
    };

    // + email
    prototype.email = function(options) {
        return this.addRule(new rules.Email(options));
    };

    // + expression
    prototype.expression = function (regularExpressionObjectOrString, options) {
        return this.addRule(new rules.Expression(regularExpressionObjectOrString, options));
    };

    // + latest
    prototype.latest = function (latestValueOrFunction, options) {
        return this.addRule(new rules.During(null, latestValueOrFunction, options));
    };

    // + length
    prototype.length = function (shortestValueOrFunction, longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, longestValueOrFunction, options));
    };

    // + matches
    prototype.matches = function (permittedValueOrFunction, options) {
        return this.addRule(new rules.Matches(permittedValueOrFunction, options));
    };

    // + maximum
    prototype.maximum = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(null, maximumValueOrFunction, options));
    };

    // + maximumNumberOfItems
    prototype.maximumNumberOfItems = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(null, maximumValueOrFunction, options));
    };

    // + maximumLength
    prototype.maximumLength = function (longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(null, longestValueOrFunction, options));
    };

    // + ruleMessage
    prototype.ruleMessage = function (message) {
        var stateRules = this.settings.rules,
            index = stateRules.length - 1,
            rule;

        if (index >= 0) {
            rule = stateRules[index];
            rule.settings.failureMessageFormat = message;
        }

        return this;
    };

    // + minimum
    prototype.minimum = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, null, options));
    };

    // + minimumNumerOfItems
    prototype.minimumNumerOfItems = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, null, options));
    };

    // + minimumLength
    prototype.minimumLength = function (shortestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, null, options));
    };

    // + noneOf
    prototype.noneOf = function (forbiddenValuesOrFunction, options) {
        return this.addRule(new rules.NoneOf(forbiddenValuesOrFunction, options));
    };

    // + not
    prototype.not = function (forbiddenValueOrFunction, options) {
        return this.addRule(new rules.Not(forbiddenValueOrFunction, options));
    };

    // + numberOfItems
    prototype.numberOfItems = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    // + oneOf
    prototype.oneOf = function (permittedValuesOrFunction, options) {
        return this.addRule(new rules.OneOf(permittedValuesOrFunction, options));
    };

    // + range
    prototype.range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    // + rule
    prototype.rule = function (testFunction) {
        return this.addRule({
            "settings": {
            },
            "test": function (value) {
                return testFunction(value);
            }
        });
    };
})();

