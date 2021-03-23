// Copyright 2021, University of Colorado Boulder

/**
 * skiffle-specific grunt configuration
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

'use strict';

// modules
const grunt = require( 'grunt' ); // eslint-disable-line
const Gruntfile = require( '../../chipper/js/grunt/Gruntfile' );
const winston = require( 'winston' );

// constants
const ACTIVE_REPOS_FILE = '../perennial/data/active-repos';

module.exports = grunt => {
  Gruntfile( grunt );

  grunt.registerTask(
    'build',
    'Build the sound board HTML file',
    () => {

      // Read in the list of active repositories, splitting the lines into separate strings.
      let activeRepos = grunt.file.read( ACTIVE_REPOS_FILE ).split( '\n' );

      // On at least some systems, such as Windows, splitting the lines up this way results in there being a carriage
      // return character at the end of the string representing the repo name.  Remove it.
      activeRepos = activeRepos.map( activeRepo => activeRepo.replace( '\r', '' ) );

      // Remove any blank lines from the list of active repos.
      activeRepos = activeRepos.filter( activeRepo => activeRepo.length > 0 );

      // Make a list of all repos with sound files.
      const reposWithSoundFiles = activeRepos.filter( activeRepo => {
        const pathToCheck = `../${activeRepo}/sounds`;
        return grunt.file.exists( pathToCheck );
      } );

      // The string that will ultimately contain the HTML that will list the sound files and allow a user to play them.
      let soundControlHtml = '';

      // For each repo with sound, create collapsible button with content beneath it to play each of the sounds by
      // pressing a button.
      reposWithSoundFiles.forEach( repoWithSoundFiles => {

        // Add the HTML for the collapsible button for this repo.
        soundControlHtml += `  <button type="button" class="collapsible">${repoWithSoundFiles}</button>\n`;
        soundControlHtml += '  <div class="content">\n';

        // Get a list of the sounds for this repo.
        const pathToSoundsDirectory = `../${repoWithSoundFiles}/sounds/`;
        const patterns = [ `${pathToSoundsDirectory}*.mp3`, `${pathToSoundsDirectory}*.wav` ];
        const soundFileNames = grunt.file.expand( { filter: 'isFile' }, patterns );

        // Create buttons for the sounds and group them together.
        const numberOfSoundsPerButtonGroup = 4;
        for ( let i = 0; i < soundFileNames.length; i += numberOfSoundsPerButtonGroup ) {

          // Output HTML for the button group.
          soundControlHtml += '    <div class="btn-group">\n';

          // Extract the subset of sounds that will be controlled by this button group.
          const soundsFilesForButtonGroup = soundFileNames.slice( i, i + numberOfSoundsPerButtonGroup );

          // Create a button for each of the sounds.
          soundsFilesForButtonGroup.forEach( soundFile => {
            const soundFileNameOnly = soundFile.substring( soundFile.lastIndexOf( '/' ) + 1 );

            // If the name of the sound file is too long, create a shortened version with an ellipsis.
            const maxButtonLabelLength = 20;
            let buttonLabel;
            if ( soundFileNameOnly.length > maxButtonLabelLength ) {
              buttonLabel = `${soundFileNameOnly.substring( 0, maxButtonLabelLength - 3 )}...`;
            }
            else {
              buttonLabel = soundFileNameOnly;
            }
            soundControlHtml += `      <button title="${soundFileNameOnly}" onClick="playSound( '../${soundFile}' )">${buttonLabel}</button>\n`;
          } );

          // Close the button group div
          soundControlHtml += '    </div>\n';
        }

        // Close the tags for this section.
        soundControlHtml += '  </div>\n';
      } );

      // Read in the HTML file template.
      const soundBoardTemplateHtml = grunt.file.read( './html/sound-board-template.html' );

      // Add in a message about the file being built.
      const message = '<!-- WARNING: This file was built, not hand generated, and should not be manually edited.  Use grunt to re-build. -->';
      const soundBoardTemplateWithMessage = soundBoardTemplateHtml.replace( '{{BUILD_MESSAGE}}', message );

      // Add in the HTML for controlling the sounds.
      const soundBoardHtml = soundBoardTemplateWithMessage.replace( '{{SOUND_CONTROL_CONTENT}}', soundControlHtml );

      // Write the HTML file with the sound control content filled in.
      grunt.file.write( './html/sound-board.html', soundBoardHtml );

      winston.info( 'Done.' );
    }
  );

  // register default task
  grunt.registerTask( 'default', [ 'build' ] );
};