// Copyright 2024, University of Colorado Boulder

/**
 * ESlint configuration for skiffle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import parent from '../chipper/eslint/node.eslint.config.mjs';

export default [
  ...parent,
  {
    languageOptions: {
      globals: {
        skiffle: 'readonly'
      }
    }
  }
];