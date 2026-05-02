// Entry point for Render deployment
// This file redirects to the actual compiled server
const path = require('path');
require(path.resolve(__dirname, 'dist/server'));
