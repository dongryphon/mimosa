"use strict";

var path = require( 'path' )
  , compilerLib = null
  , setCompilerLib = function ( _compilerLib ) {
    compilerLib = _compilerLib;
  };

var prefix = function ( config, libraryPath ) {
  if ( config.template.wrapType === "amd" ) {
    return "define(['" + libraryPath + "'], function (dust){ ";
  } else {
    if ( config.template.wrapType === "common" ) {
      return "var dust = require('" + config.template.commonLibPath + "');\n";
    }
  }

  return "";
};

var suffix = function ( config ) {
  if ( config.template.wrapType === "amd" ) {
    return 'return dust; });';
  } else {
    if ( config.template.wrapType === "common" ) {
      return "\nmodule.exports = dust;";
    }
  }

  return "";
};

var compile = function ( file, cb ) {
  var error, output;

  if ( !compilerLib ) {
    compilerLib = require( 'dustjs-linkedin' );
  }

  try {
    output = compilerLib.compile( file.inputFileText, file.templateName );
  } catch (err) {
    error = err;
  }

  cb( error, output );
};

module.exports = {
  name: "dust",
  compilerType: "template",
  defaultExtensions: ["dust"],
  clientLibrary: path.join( __dirname, "client", "dust.js" ),
  handlesNamespacing: true,
  compile: compile,
  suffix: suffix,
  prefix: prefix,
  setCompilerLib: setCompilerLib
};