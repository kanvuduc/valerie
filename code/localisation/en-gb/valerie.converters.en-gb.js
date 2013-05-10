﻿// valerie.converters.en-gb
// - additional converters for the en-gb locale
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../../core/valerie.formatting.js"/>

/*jshint eqnull: true */
/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        postcodeExpression = /^([A-Z][A-Z]?)((?:[0-9][A-Z])|(?:[0-9]{1,2}))\s*([0-9])([A-Z][A-Z])$/i;
    
    // + converters.postcode
    converters.postcode = {
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value;
        },
        "parser": function (value) {
            if (value == null) {
                return null;
            }

            var matches = value.match(postcodeExpression);

            if (matches == null) {
                return null;
            }

            return (matches[1] + matches[2] + " " + matches[3] + matches[4]).toUpperCase();
        }
    };
})();