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

      // Add the enclosing div for the accordion region.
      soundControlHtml += '  <div className="accordion" id="accordionExample">\n';

      // For each repo with sound, create collapsible card with content beneath it to play each of the sounds by
      // pressing a button.
      reposWithSoundFiles.forEach( ( repoWithSoundFiles, index ) => {

        // variables for filling in the HTML
        const headingId = `heading${index}`;
        const collapseId = `collapse${index}`;

        // The set of sounds for each repo is on a bootstrap card.
        soundControlHtml += '    <div class="card">\n';

        // card header
        const collapsedString = index > 0 ? ' collapsed' : '';
        const ariaExpanded = ( index > 0 ).toString();
        soundControlHtml += `      <div class="card-header" id="${headingId}">\n`;
        soundControlHtml += '        <h5 class="mb-0">\n';
        soundControlHtml += `          <button class="btn btn-link${collapsedString}" type="button" data-toggle="collapse" data-target="#${collapseId}" aria-expanded="${ariaExpanded}" aria-controls="${collapseId}">\n`;
        soundControlHtml += `            ${repoWithSoundFiles}\n`;
        soundControlHtml += '          </button>\n';
        soundControlHtml += '        </h5>\n';
        soundControlHtml += '      </div>\n';
        soundControlHtml += '\n';

        // card body
        const classString = index > 0 ? 'collapse' : 'collapse show';
        soundControlHtml += `      <div id="${collapseId}" class="${classString}" aria-labelledby="headingOne" data-parent="#accordionExample">\n`;
        soundControlHtml += '        <div class="card-body">\n';

        // Get a list of the sounds for this repo.
        const pathToSoundsDirectory = `../${repoWithSoundFiles}/sounds/`;
        const patterns = [ `${pathToSoundsDirectory}*.mp3`, `${pathToSoundsDirectory}*.wav` ];
        const soundFileNames = grunt.file.expand( { filter: 'isFile' }, patterns );

        // Create buttons for the sounds and group them together.
        soundFileNames.forEach( soundFileName => {
          const soundFileNameOnly = soundFileName.substring( soundFileName.lastIndexOf( '/' ) + 1 );

          // If the name of the sound file is too long, create a shortened version with an ellipsis.
          const maxButtonLabelLength = 20;
          let buttonLabel;
          if ( soundFileNameOnly.length > maxButtonLabelLength ) {
            buttonLabel = `${soundFileNameOnly.substring( 0, maxButtonLabelLength - 3 )}...`;
          }
          else {
            buttonLabel = soundFileNameOnly;
          }
          soundControlHtml += `      <button title="${soundFileNameOnly}" onClick="playSound( '../${soundFileName}' )">${buttonLabel}</button>\n`;
        } );

        // Close the various card divs.
        soundControlHtml += '        </div>\n';
        soundControlHtml += '      </div>\n';
        soundControlHtml += '    </div>\n';
      } );

      // Add the closing div tag for the accordion region.
      soundControlHtml += '  </div>\n';

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