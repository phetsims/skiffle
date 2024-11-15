// Copyright 2021-2024, University of Colorado Boulder

const Gruntfile = require( '../chipper/Gruntfile' );
const registerTasks = require( '../perennial-alias/js/grunt/commonjs/registerTasks' );

/**
 * Dot grunt tasks
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
module.exports = function( grunt ) {
  Gruntfile( grunt ); // use chipper's gruntfile
  registerTasks( grunt, `${__dirname}/js/grunt/tasks/` ); // second so it overrides the default task
};