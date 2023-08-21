// Styles
import 'mini.css/dist/mini-dark.css';

// Other imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FrayToolsPluginCore from '@fraytools/plugin-core';
import ProjectileCreator from './ProjectileCreator';
import { IManifestJson } from '@fraytools/plugin-core/lib/types';
import { IFraymakersMetadataConfig } from './types';

// const semverCompare = require('semver-compare');

declare var MANIFEST_JSON:IManifestJson;

// Informs FrayToolsPluginCore of the default config metadata for plugin when it first gets initialized
FrayToolsPluginCore.PLUGIN_CONFIG_METADATA_DEFAULTS = ProjectileCreator.getDefaultSettings();


FrayToolsPluginCore.migrationHandler = (configMetadata:IFraymakersMetadataConfig) => {
  configMetadata.version = MANIFEST_JSON.version;
};

FrayToolsPluginCore.setupHandler = (props) => {
  // Create a new container for the plugin
  var appContainer = document.createElement('div');
  appContainer.className = 'ProjectileCreatorWrapper';
  document.body.appendChild(appContainer);

  // Load the component with its props into the document body
  ReactDOM.render(<ProjectileCreator {...props} />, appContainer);
};
