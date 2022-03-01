// @ts-nocheck
// @ts-ignore
import { Sandbox } from "./sandbox";
import { GridMaterial } from "@babylonjs/materials/grid";
import "@babylonjs/inspector";
import "@babylonjs/core/Legacy/legacy";

window.addEventListener("DOMContentLoaded", () => {
  const hostElement = document.getElementById("host-element");

  Sandbox.Show(hostElement);
  console.log(Sandbox.Show);

  // HACK to fix inspector grid material
  window.BABYLON.GridMaterial = GridMaterial;
});
