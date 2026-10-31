/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_IS_DEV: boolean
    readonly VITE_SITE_ROOT: string
    readonly VITE_ASSETS_ROOT: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }