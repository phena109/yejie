/// <reference types="vite/client" />

interface YejieDebug {
  /** Live game instance for local QA. Typed loose so the hook stays out of the game module. */
  game?: unknown;
  forceWin: () => void;
  /** Tile under a viewport point, or null. Same pick as a board click. */
  tileAtScreen: (clientX: number, clientY: number) => { x: number; y: number } | null;
  /** Viewport point of the tile's top-face centre. */
  screenOfTile: (x: number, y: number) => { x: number; y: number };
}

interface Window {
  __yejieDebug?: YejieDebug;
}
