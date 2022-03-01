import * as React from "react";
import { GlobalState } from "../globalState";
import { FooterButton } from "./footerButton";
import { DropUpButton } from "./dropUpButton";
import { EnvironmentTools } from "../tools/environmentTools";
import { FooterFileButton } from "./footerFileButton";
import { AnimationBar } from "./animationBar";
import { Nullable } from "@babylonjs/core/types";
import { KHR_materials_variants } from "@babylonjs/loaders/glTF/2.0/Extensions/KHR_materials_variants";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Sandbox } from "../sandbox";

require("../scss/footer.scss");
var babylonIdentity = require("../img/babylon-identity.svg");
var iconEdit = require("../img/icon-edit.svg");
var iconOpen = require("../img/icon-open.svg");
var iconIBL = require("../img/icon-ibl.svg");
// var iconCameras = require("../img/icon-cameras.svg");
// var iconVariants = require("../img/icon-variants.svg");
var iconSkybox = require("../img/icon-skybox.svg");

interface IFooterProps {
  globalState: GlobalState;
}

export class Footer extends React.Component<IFooterProps> {
  private _cameraNames: string[] = [];

  public constructor(props: IFooterProps) {
    super(props);
    props.globalState.onSceneLoaded.add((info) => {
      this._updateCameraNames();
      this.forceUpdate();
    });
  }

  showInspector() {
    if (this.props.globalState.currentScene) {
      if (this.props.globalState.currentScene.debugLayer.isVisible()) {
        this.props.globalState.hideDebugLayer();
      } else {
        this.props.globalState.showDebugLayer();
      }
    }
  }

  async screenshot() {
    await Sandbox.CaptureScreenshot(288);
  }

  switchCamera(name: string) {
    let camera = this.props.globalState.currentScene!.getCameraByName(name);

    if (camera) {
      if (this.props.globalState.currentScene!.activeCamera) {
        this.props.globalState.currentScene!.activeCamera.detachControl();
      }
      this.props.globalState.currentScene!.activeCamera = camera;
      camera.attachControl();
    }
  }

  private _updateCameraNames(): void {
    if (!!this.props.globalState.currentScene && this.props.globalState.currentScene.cameras.length > 0) {
      this._cameraNames = this.props.globalState.currentScene.cameras.map((c) => c.name);
      this._cameraNames.push("default camera");
    }
  }

  private _getVariantsExtension(): Nullable<KHR_materials_variants> {
    return this.props.globalState?.glTFLoaderExtensions["KHR_materials_variants"] as KHR_materials_variants;
  }

  render() {
    let variantNames: string[] = [];
    let hasVariants = false;
    let activeEntry = () => "";
    let switchVariant = (name: string) => { };
    const variantExtension = this._getVariantsExtension();
    if (variantExtension && this.props.globalState.currentScene) {
      let scene = this.props.globalState.currentScene;
      let rootNode = scene.getMeshByName("__root__") as Mesh;

      if (rootNode) {
        let variants: string[] = variantExtension.getAvailableVariants(rootNode);

        if (variants && variants.length > 0) {
          hasVariants = true;

          variants.splice(0, 0, "Original");
          variantNames = variants;

          activeEntry = () => {
            let lastPickedVariant = variantExtension!.getLastSelectedVariant(rootNode) || 0;
            if (lastPickedVariant && Object.prototype.toString.call(lastPickedVariant) === "[object String]") {
              return lastPickedVariant as string;
            }

            return variantNames[0];
          };
        }
      }
    }

    const hasCameras = this._cameraNames.length > 1;

    return (
      <div id="footer" className={"footer" + (hasCameras || hasVariants ? " long" : hasCameras && hasVariants ? " longer" : "")}>
        <div className="footerLeft">
          <img id="logoImg" src={babylonIdentity} />
        </div>
        <AnimationBar globalState={this.props.globalState} enabled={!!this.props.globalState.currentScene} />
        <div className={"footerRight"}>
          <FooterFileButton
            globalState={this.props.globalState}
            enabled={true}
            icon={iconOpen}
            onFilesPicked={(evt, files) => {
              this.props.globalState.filesInput.loadFiles(evt);
            }}
            label="Open your scene from your hard drive (.babylon, .gltf, .glb, .obj)"
          />
          <DropUpButton
            globalState={this.props.globalState}
            icon={iconIBL}
            label="Select environment"
            options={EnvironmentTools.EnvironmentsNames}
            onOptionPicked={(option) =>
              this.props.globalState.onEnvironmentChanged.notifyObservers(
                option
              )
            }
            enabled={!!this.props.globalState.currentScene}
          />
          <DropUpButton
            globalState={this.props.globalState}
            icon={iconSkybox}
            label="Select Skybox"
            options={EnvironmentTools.SkyboxesNames}
            onOptionPicked={(option) =>
              this.props.globalState.onSkyBoxChanged.notifyObservers(option)
            }
            enabled={!!this.props.globalState.currentScene}
          />
          <FooterButton
            globalState={this.props.globalState}
            icon={iconEdit}
            label="Display inspector"
            onClick={() => this.showInspector()}
            enabled={!!this.props.globalState.currentScene}
          />

          <FooterButton
            globalState={this.props.globalState}
            icon={iconEdit}
            label="Screenshot"
            onClick={() => this.screenshot()}
            enabled={!!this.props.globalState.currentScene}
          />
        </div>
      </div>
    );
  }
}
