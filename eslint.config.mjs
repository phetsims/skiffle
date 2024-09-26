// Copyright 2024, University of Colorado Boulder

/**
 * ESlint configuration for skiffle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import nodeEslintConfig from '../chipper/eslint/node.eslint.config.mjs';

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