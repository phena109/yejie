import "./style.css";
import { audio } from "./game/audio";
import { Game } from "./game/game";
import { loadSprites } from "./game/sprites";

const canvas = document.getElementById("board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("board");

void loadSprites();
document.addEventListener(
  "pointerdown",
  () => {
    audio.unlock();
  },
  { capture: true },
);
document.addEventListener(
  "click",
  (e) => {
    if ((e.target as HTMLElement).closest("button")) audio.play("ui");
  },
  true,
);

const game = new Game(canvas);
game.applyHash();
game.start();

const shot = location.search.includes("shot");
if ("serviceWorker" in navigator && !shot) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
  });
}
