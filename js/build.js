// Copyright 2024-2026, University of Colorado Boulder

/**
 * Build the soundboard HTML file.
 *
 * Set TOTALITY_PATH environment variable to point to your totality checkout.
 * Defaults to ../totality (assuming skiffle is a sibling directory).
 *
 * Usage:
 *   TOTALITY_PATH=/path/to/totality node js/build.js
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

const dot = require( 'dot' );
const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );

// Resolve the totality path from environment or default to sibling directory
const totalityPath = path.resolve( process.env.TOTALITY_PATH || path.join( __dirname, '..', '..', 'totality' ) );

if ( !fs.existsSync( totalityPath ) ) {
  console.error( `Error: totality path not found: ${totalityPath}` );
  console.error( 'Set TOTALITY_PATH environment variable to your totality checkout.' );
  process.exit( 1 );
}

console.log( `Using totality at: ${totalityPath}` );

// Compute the relative path from skiffle/html/ to the totality directory, for use in generated HTML paths.
const htmlDir = path.join( __dirname, '..', 'html' );
const relativeToTotality = path.relative( htmlDir, totalityPath );

// Constants
const ACTIVE_REPOS_FILE = path.join( totalityPath, 'perennial-alias/data/active-repos' );
const TEMPLATE_FILE = path.join( __dirname, '..', 'html', 'sound-board-template.html' );
const OUTPUT_FILE = path.join( __dirname, '..', 'html', 'sound-board.html' );

// Configure the dot templating engine to our liking.
dot.templateSettings.strip = false;

// Read in the template file.
const templateFileContents = fs.readFileSync( TEMPLATE_FILE, 'utf8' );

// Compile the template into a function.
const templateFunction = dot.template( templateFileContents );

// Read in the list of active PhET repositories.
let activeRepos = fs.readFileSync( ACTIVE_REPOS_FILE, 'utf8' ).split( '\n' );
activeRepos = activeRepos.map( repo => repo.replace( '\r', '' ).trim() );
activeRepos = activeRepos.filter( repo => repo.length > 0 );

// Make a list of all repos with sound files.
const reposWithSoundFiles = activeRepos.filter( repo => {
  return fs.existsSync( path.join( totalityPath, repo, 'sounds' ) );
} );

// {Object[]} - an array of objects containing information about the sounds for each repo
const repoSoundInfoArray = [];

// Go through each repo on the list and create an object with information about the sounds it contains.
reposWithSoundFiles.forEach( ( repoName, index ) => {

  const soundsDir = path.join( totalityPath, repoName, 'sounds' );
  const soundFiles = glob.sync( '*.{mp3,wav}', { cwd: soundsDir } );
  const individualSoundsInfoArray = [];

  soundFiles.forEach( soundFileName => {

    // If the name of the sound file is too long, create a shortened version with an ellipsis.
    const maxButtonLabelLength = 25;
    let buttonLabel;
    if ( soundFileName.length > maxButtonLabelLength ) {
      buttonLabel = `${soundFileName.substring( 0, maxButtonLabelLength - 3 )}...`;
    }
    else {
      buttonLabel = soundFileName;
    }

    individualSoundsInfoArray.push( {
      buttonTitle: soundFileName,
      soundFileFullPath: `${relativeToTotality}/${repoName}/sounds/${soundFileName}`,
      buttonLabel: buttonLabel
    } );
  } );

  repoSoundInfoArray.push( {
    repoName: repoName,
    cardHeaderID: `heading${index}`,
    collapseID: `collapse${index}`,
    individualSoundsInfoArray: individualSoundsInfoArray
  } );
} );

// Create the output HTML by invoking the template function with the values needed to fill it in.
const soundBoardHtml = templateFunction( {
  buildMessage: '<!-- WARNING: This file was built, not hand generated, and should not be manually edited. Use "node js/build.js" to re-build. -->',
  repoSoundInfoArray: repoSoundInfoArray
} );

// Write the output file.
fs.writeFileSync( OUTPUT_FILE, soundBoardHtml );

console.log( `Build complete. Wrote ${OUTPUT_FILE}` );
