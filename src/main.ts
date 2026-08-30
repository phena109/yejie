import "./style.css";
import { Game } from "./game/game";

const canvas = document.getElementById("board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("board");

const game = new Game(canvas);
game.start();

if (location.hash === "#play") {
  document.getElementById("btn-start")?.click();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("./sw.js");
  });
}
