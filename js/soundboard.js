// Copyright 2021, University of Colorado Boulder

/**
 * JavaScript for the soundboard HTML file.
 */

// create a Web Audio context
let audioContext = null;
if ( window.AudioContext ) {
  audioContext = new window.AudioContext();
}
else if ( window.webkitAudioContext ) {
  audioContext = new window.webkitAudioContext();
}
else {

  // The browser doesn't support creating an audio context, create an empty object.  Failures will occur the first time
  // any code tries to do anything with the audio context.
  audioContext = {};
  console.error( 'error: this browser does not support Web Audio' );
}

// Map.<string,AudioBuffer> - map of file paths to decoded audio buffers, used to cache decoded audio data
const filePathToDecodedAudioBufferMap = new Map();

// function to play a previously decoded audio buffer
const playAudioBuffer = audioBuffer => {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.connect( audioContext.destination );
  bufferSource.start();
};

// function to play a sound file, will used cached data if possible or will initiate decode if not
const playSound = soundUrl => { // eslint-disable-line no-unused-vars
  const audioBuffer = filePathToDecodedAudioBufferMap.get( soundUrl );
  if ( audioBuffer ) {

    // This file has already been decoded, so just play it.
    playAudioBuffer( audioBuffer );
  }
  else {

    // This is the first time this file has been played, so it needs to be decoded and then played.
    window.fetch( soundUrl )
      .then( response => response.arrayBuffer() )
      .then( arrayBuffer => audioContext.decodeAudioData( arrayBuffer ) )
      .then( audioBuffer => {
        filePathToDecodedAudioBufferMap.set( soundUrl, audioBuffer );
        playAudioBuffer( audioBuffer );
      } )
      .catch( error => {
        console.log( `unable to play file ${soundUrl}, error = ${error}` );
      } );
  }
};