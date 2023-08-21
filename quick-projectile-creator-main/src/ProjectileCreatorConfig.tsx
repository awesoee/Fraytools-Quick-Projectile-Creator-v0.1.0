import * as React from 'react';
import { render } from 'react-dom';

import * as _ from 'lodash';
import * as uuid from 'uuid';
import { webpack } from 'webpack';

import { ILibraryAssetMetadata } from '@fraytools/plugin-core/lib/types/fraytools';
import { IManifestJson } from '@fraytools/plugin-core/lib/types';

import ProjectileCreatorPlugin from './ProjectileCreator';
import './ProjectileCreatorConfig.scss';
import { ProjectileCreatorPreset } from './types';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';


declare var MANIFEST_JSON:IManifestJson;

interface ProjectileCreatorConfigProps {
    projectileCreator:ProjectileCreatorPreset[];
    onUpdated:(ProjectileCreator:ProjectileCreatorPreset[]) => number
  }
  
  interface ProjectileCreatorConfigState {
    projectileCreator?:ProjectileCreatorPreset[];
    fileContent:string|ArrayBuffer,
    manifestInput:null
  }

class ProjectileCreatorConfig extends React.Component<ProjectileCreatorConfigProps, ProjectileCreatorConfigState> {
    nameField:React.RefObject<HTMLInputElement>;
    manifestField:React.RefObject<HTMLInputElement>;

    constructor(props) {
      super(props);
  
      this.state = {
        projectileCreator: this.props.projectileCreator || [],
        fileContent:"",
        manifestInput:null
      };
  
      this.nameField = React.createRef();
      this.manifestField = React.createRef();
    }

    public static getDefaults() {
        return {

        }
    } 

      onUpdated() {
        this.props.onUpdated(this.state.projectileCreator);
      }

      readManifest = (event) => {
        const manifestInput = event.target.files[0];
        if (manifestInput) {
          const fileReader = new FileReader();
    
          fileReader.onload = (e) => {
            const fileContent = e.target.result;
            this.setState({ manifestInput, fileContent });
            this.updateFileContent();
          };
    
          fileReader.onerror = (error) => {
            console.error("Error", error);
          };
    
          fileReader.readAsText(manifestInput);
        }
      };   
      
      updateFileContent = () => {
        const { fileContent } = this.state;
    
        if (fileContent) {
          let parsedManifest = null;
    
          try {
            if (typeof fileContent === 'string') {
              parsedManifest = JSON.parse(fileContent);
            } else if (fileContent instanceof ArrayBuffer) {
              const textDecoder = new TextDecoder();
              const text = textDecoder.decode(fileContent);
              parsedManifest = JSON.parse(text);
            }
    
            if (parsedManifest) {

              let name = this.nameField.current.value

              const additionalData = {
                "id": name,
                "type": "projectile",
                "objectStatsId": name + 'Stats',
                "animationStatsId": name + 'AnimationStats',
                "hitboxStatsId": name + 'HitboxStats',
                "scriptId": name + 'Script',
                "costumesId": "charactertemplateCostumes"
              };

              const modifiedManifest = {
                ...parsedManifest,
                content: [...parsedManifest.content, additionalData],
              };
    
              const fileContent = JSON.stringify(modifiedManifest, null, 2);
              this.setState({ fileContent });
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      };
      
      //dear god

       downloadZIP = async () => {
        if (!this.nameField.current.value || !this.manifestField.current.value) {
          return;
        }
        this.setState({
          projectileCreator: [...this.state.projectileCreator, {
            name: this.nameField.current.value
          }]
        }, () => {
          this.onUpdated();
        })
        try {

            var name = this.nameField.current.value;
            const zip = new JSZip();


            const projectileScript = './ProjectileScript/source/ProjectileScript.hx';
            const projectileStats = './ProjectileScript/source/ProjectileStats.hx';
            const projectileAnimationStats = './ProjectileScript/source/ProjectileAnimationStats.hx';
            const projectileHitboxStats = './ProjectileScript/source/ProjectileHitboxStats.hx';
            const entityProjectile = './ProjectileScript/source/projectile.entity'

            const metaProjectileScript = './ProjectileScript/source/ProjectileScript.hx.meta';
            const metaProjectileStats = './ProjectileScript/source/ProjectileStats.hx.meta';
            const metaProjectileAnimationStats = './ProjectileScript/source/ProjectileAnimationStats.hx.meta';
            const metaProjectileHitboxStats = './ProjectileScript/source/ProjectileHitboxStats.hx.meta';

            const projectileScriptResponse = await fetch(projectileScript);
            const projectileScriptContent = await projectileScriptResponse.text();

            const projectileAnimationStatsResponse = await fetch(projectileAnimationStats);
            const projectileAnimationStatsContent = await projectileAnimationStatsResponse.text();

            const projectileStatsResponse = await fetch(projectileStats);
            const projectileStatsContent = await projectileStatsResponse.text();

            const projectileHitboxStatsResponse = await fetch(projectileHitboxStats);
            const projectileHitboxStatsContent = await projectileHitboxStatsResponse.text();

            const entityResponse = await fetch(entityProjectile);
            const entityContent = await entityResponse.json()



            const metaProjectileScriptResponse = await fetch(metaProjectileScript);
            const metaProjectileScriptContent = await metaProjectileScriptResponse.text();
            const regexMetaScript = metaProjectileScriptContent.replace(/charactertemplateNspecProjectile|w2w2w2w2/g, (match) => {
              if (match === 'charactertemplateNspecProjectile') {
                return name;
              } else {
                return uuid.v4();
              }
            });

            const metaProjectileStatsResponse = await fetch(metaProjectileStats);
            const metaProjectileStatsContent = await metaProjectileStatsResponse.text();
            const regexMetaStats = metaProjectileStatsContent.replace(/charactertemplateNspecProjectile|w2w2w2w2/g, (match) => {
              if (match === 'charactertemplateNspecProjectile') {
                return name;
              } else {
                return uuid.v4();
              }
            });

            const metaProjectileAnimationStatsResponse = await fetch(metaProjectileAnimationStats);
            const metaProjectileAnimationStatsContent = await metaProjectileAnimationStatsResponse.text();
            const regexMetaAnimationStats = metaProjectileAnimationStatsContent.replace(/charactertemplateNspecProjectile|w2w2w2w2/g, (match) => {
              if (match === 'charactertemplateNspecProjectile') {
                return name;
              } else {
                return uuid.v4();
              }
            });

            const metaProjectileHitboxStatsResponse = await fetch(metaProjectileHitboxStats);
            const metaProjectileHitboxStatsContent = await metaProjectileHitboxStatsResponse.text();
            const regexMetaHitboxStats = metaProjectileHitboxStatsContent.replace(/charactertemplateNspecProjectile|w2w2w2w2/g, (match) => {
              if (match === 'charactertemplateNspecProjectile') {
                return name;
              } else {
                return uuid.v4();
              }
            });

            const uuidDupes = {};

            const updateUUIDs = (data) => {
              return _.cloneDeepWith(data, (value) => {
                if (_.isString(value) && value.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i)) {
                  if (!uuidDupes[value]) {
                    uuidDupes[value] = uuid.v4();
                  }
                  return uuidDupes[value];
                }
              });
            };

            const updatedProjectileEntity = updateUUIDs(entityContent);
            const stringifiedProjectileEntity = JSON.stringify(updatedProjectileEntity, null, 2)
            const regexProjectileEntity = stringifiedProjectileEntity.replace(/thissentencerighthereisaplaceholderforregexisntthatcool/g, name)
          
            zip.file(name + '.entity', regexProjectileEntity);
            zip.file('manifest.json', this.state.fileContent);

            const subfolder = zip.folder(name);

              subfolder.file(name + 'Script.hx', projectileScriptContent);
              subfolder.file(name + 'Script.hx.meta', regexMetaScript);

              subfolder.file(name + 'AnimationStats.hx', projectileAnimationStatsContent);
              subfolder.file(name + 'AnimationStats.hx.meta', regexMetaAnimationStats);

              subfolder.file(name + 'Stats.hx', projectileStatsContent);
              subfolder.file(name + 'Stats.hx.meta', regexMetaStats);

              subfolder.file(name + 'HitboxStats.hx', projectileHitboxStatsContent);
              subfolder.file(name + 'HitboxStats.hx.meta', regexMetaHitboxStats);

            const zipBlob = await zip.generateAsync({type: 'blob'});
            saveAs(zipBlob, [name] + '.zip');

        } catch (error) {
            console.error('Error:', error);
        }
    }

    public render() {

        return (
      <div>
          <div>
            <fieldset className='nameFieldSet'>
              <label htmlFor='nameInput'><h2>Projectile Name</h2></label>
              <input className='customInput' ref={this.nameField} type='text' id='nameInput' />
              <br/>
              <br/>
              <br/>
            </fieldset>
            
            <br/>

            <fieldset className='manifestFieldSet'>
              <label htmlFor='manifestInput'><h2>Link MANIFEST.JSON</h2></label>
              <br/>
              <input className='customFileInput' ref={this.manifestField} type='file' accept=".json" id='manifestInput' onChange={this.readManifest}/>
              <br/>
              <br/>
              <br/>
            </fieldset>


            <button className='saveButton' onClick={this.downloadZIP.bind(this)}>Save</button>
          </div>
        </div>
        );
    }
}

export default ProjectileCreatorConfig;
