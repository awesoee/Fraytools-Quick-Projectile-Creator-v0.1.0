import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
// Import FrayToolsPluginCore.js and BaseMetadataDefinitionPlugin.js
import './ProjectileCreator.scss';
import ProjectileCreatorConfig from './ProjectileCreatorConfig';
import FrayToolsPluginCore from '@fraytools/plugin-core';
import BaseTypeDefinitionPlugin, { IMetadataDefinitionPluginProps, IMetadataDefinitionPluginState } from '@fraytools/plugin-core/lib/base/BaseMetadataDefinitionPlugin';
import { IManifestJson, IMetadataDefinition, IMetadataDefinitionConditional, IMetadataDefinitionDropdownFieldData, IMetadataDefinitionDropdownFieldDataOptions, IMetadataDefinitionEffect } from '@fraytools/plugin-core/lib/types';
import { ProjectileCreatorPreset, IFraymakersMetadataConfig, IFraymakersMetadataPluginAssetMetadata } from './types';
import { ILibraryAssetMetadata, ISpriteEntityAssetMetadata, KeyframeTypes, LayerTypes } from '@fraytools/plugin-core/lib/types/fraytools';
import { version } from 'html-webpack-plugin';

const semverCompare = require('semver-compare');

declare var MANIFEST_JSON:IManifestJson;

interface IFraymakersMetadataProps extends IMetadataDefinitionPluginProps {
  configMetadata:IFraymakersMetadataConfig;
  assetMetadata: IFraymakersMetadataPluginAssetMetadata;
}
interface IFraymakersMetadataState extends IMetadataDefinitionPluginState {
  projectileCreator: ProjectileCreatorPreset[];
}

/**
 * Example view for the metadata definition plugin.
 * Note: Types plugins run hidden in the background and thus will not be visible.
 */
export default class ProjectileCreatorPlugin extends BaseTypeDefinitionPlugin<IFraymakersMetadataProps, IFraymakersMetadataState> {  

  constructor(props) {
    super(props);


    this.state = {
      projectileCreator: this.props.configMetadata.projectileCreator || []
    };

  }

  public static getDefaultSettings():IFraymakersMetadataConfig {
    return {
      version: MANIFEST_JSON.version,
      projectileCreator: []
    };
  }
  /**
   * Force this component to re-render when parent window sends new props
   */
  onPropsUpdated(props) {
    ReactDOM.render(<ProjectileCreatorPlugin {...props} />, document.querySelector('.ProjectileCreatorWrapper'));
  }


  /**
   * Send metadata definition collection data here. This function will be called automatically when a 'getMetadataDefinitionConfig' message is received via postMessage().
   * @returns 
   */
  onMetadataDefinitionRequest() {
    // Return metadata definitions
  }
  /**
   * Send fields to overwrite metadata on the current asset. 
   */
  onAssetMetadataMigrationRequest() {
    var tags = this.props.assetMetadata.tags;
    // We will add a custom tag to the asset using a migration.
    if (this.props.assetMetadata.tags.indexOf('custom') < 0) {
      tags.push('custom');
    } else {
      // Pass null to inform FrayTools no migration is required
      FrayToolsPluginCore.sendAssetMetadataMigrations(null);
      return;
    }
    FrayToolsPluginCore.sendAssetMetadataMigrations({
      tags: tags
    } as ILibraryAssetMetadata);
  }
  
  onNameFieldUpdated(ProjectileCreator:ProjectileCreatorPreset[]) {
    // Update name
    let configClone = {...this.props.configMetadata };
    configClone.projectileCreator = ProjectileCreator;
    FrayToolsPluginCore.configMetadataSync(configClone);
  }


public render() {
    if (this.props.configMode) {

      // If configMode is enabled, display a different view specifically for configuring the plugin
      return (
        <>
        <body style={{ backgroundColor: "#111111", }}>
            <div className="ProjectileCreatorContainer">
              <h2 className='title'>Awesome's Projectile Creator v{MANIFEST_JSON.version}</h2> <br/>
              <div className='container'>
                <div className='row'>
                  <div className="col-sm-12">
                    <ProjectileCreatorConfig
                      projectileCreator={this.props.configMetadata.projectileCreator}
                      onUpdated={this.onNameFieldUpdated.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </body>
          </> 
      );
    }

    // Note: MetadataDefinitionPlugins that aren't in config mode run in the background and thus do not display a view while active
    return <div/>;
  }
}



