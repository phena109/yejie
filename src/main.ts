import "./style.css";
import { Game } from "./game/game";

const canvas = document.getElementById("board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("board");

const game = new Game(canvas);
game.applyHash();
game.start();

const shot = location.search.includes("shot");
if ("serviceWorker" in navigator && !shot) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("./sw.js");
  });
}
