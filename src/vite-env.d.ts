/// <reference types="vite/client" />

interface YejieDebug {
  forceWin: () => void;
}

interface Window {
  __yejieDebug?: YejieDebug;
}
