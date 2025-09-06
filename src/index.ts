import zapier, { defineApp } from 'zapier-platform-core';

import authentication from './authentication';
import { befores, afters } from './middleware';

const packageJson = require('../package.json');

import getPublish from './triggers/publish';

import getProjects from './triggers/projects';

import createUpload from './creates/upload';

export default defineApp({
  version: packageJson.version,
  platformVersion: zapier.version,

  authentication,
  beforeRequest: [...befores],
  afterResponse: [...afters],

  // Add your triggers here for them to show up!
  triggers: {
    [getPublish.key]: getPublish,
    [getProjects.key]: getProjects
  },

  // Add your creates here for them to show up!
  creates: {
    [createUpload.key]: createUpload
  },
});
