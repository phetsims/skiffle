// Copyright 2024, University of Colorado Boulder

/**
 * ESLint configuration for skiffle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import nodeEslintConfig from '../perennial-alias/js/eslint/node.eslint.config.mjs';

export default [
  ...nodeEslintConfig,
  {
    languageOptions: {
      globals: {
        skiffle: 'readonly'
      }
    }
  }
];