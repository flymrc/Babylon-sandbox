import { EquiRectangularCubeTexture } from '@babylonjs/core';
import { HDRCubeTexture } from '@babylonjs/core/Materials/Textures/hdrCubeTexture';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture';
import { Scene } from '@babylonjs/core/scene';
import { LocalStorageHelper } from './localStorageHelper';
import { GlobalState } from '../globalState';
import { Engine } from '@babylonjs/core/Engines/engine';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3, Color4 } from "@babylonjs/core/Maths/math";

export class EnvironmentTools {
  public static EnvironmentPath = "";

  public static Skyboxes = [
    'skybox/01.png',
    'skybox/02.png',
    'skybox/03.png',
    'skybox/04.png',
    'skybox/05.png',
    'skybox/06.png',
    'skybox/07.png',
    'skybox/08.png',
    'skybox/09.png',
    'skybox/10.png',
    'skybox/11.png',
    'skybox/12.png',
    'skybox/13.png',
  ];
  public static SkyboxesNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
  ];

  public static Environments = [
    'env/01.hdr',
    'env/02.hdr',
    'env/03.hdr',
  ];
  public static EnvironmentsNames = [
    "01",
    "02",
    "03"
  ];

  public static LoadEnvironmentAndSkybox(scene: Scene) {
    this.LoadSkybox(scene);
    return this.LoadEnvironmentTexture(scene);
  }

  public static LoadEnvironmentTexture(scene: Scene) {
    var defaultEnvIndex = Math.max(
      0,
      LocalStorageHelper.ReadLocalStorageValue("defaultEnvId", 0)
    );
    let path =
      EnvironmentTools.EnvironmentPath || this.Environments[defaultEnvIndex];
    return new HDRCubeTexture(path, scene, 128, false, true, false, true);
  }

  public static LoadSkybox(scene: Scene) {
    const defaultSkyboxIndex = Math.max(
      0,
      LocalStorageHelper.ReadLocalStorageValue("defaultSkyboxId", 0)
    );

    const path = this.Skyboxes[defaultSkyboxIndex];
    const texture = new EquiRectangularCubeTexture(path, scene, 128);
    scene.getNodeByName("hdrSkyBox")?.dispose();
    scene.createDefaultSkybox(texture, false, 1000, 0, false);
  }

  public static GetActiveSkyboxName() {
    var defaultSkyboxIndex = Math.max(0, LocalStorageHelper.ReadLocalStorageValue("defaultSkyboxId", 0));
    return this.SkyboxesNames[defaultSkyboxIndex];
  }

  public static HookWithEnvironmentChange(globalState: GlobalState) {
    globalState.onEnvironmentChanged.add((option) => {
      EnvironmentTools.EnvironmentPath = "";
      let index = EnvironmentTools.SkyboxesNames.indexOf(option);

      if (typeof Storage !== "undefined") {
        localStorage.setItem("defaultEnvId", index.toString());
      }

      var currentScene = Engine.LastCreatedScene!;
      this.LoadSkybox(currentScene);
      currentScene.environmentTexture =
        this.LoadEnvironmentTexture(currentScene);
    });

    globalState.onSkyBoxChanged.add((option) => {
      let index = EnvironmentTools.SkyboxesNames.indexOf(option);

      if (typeof Storage !== "undefined") {
        localStorage.setItem("defaultSkyboxId", index.toString());
      }

      var currentScene = Engine.LastCreatedScene!;
      this.LoadSkybox(currentScene);
    });
  }
}