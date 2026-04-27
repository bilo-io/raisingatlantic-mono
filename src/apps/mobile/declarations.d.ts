declare module "*.svg" {
  import type { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// Ambient shims for upstream modules whose .ts source is resolved via
// the expo react-native customConditions but ship without type declarations.
declare module "@react-native/assets-registry/registry" {
  export type PackagerAsset = any;
  export const getAssetByID: (id: number) => any;
  const _default: any;
  export default _default;
}

declare module "react-native/Libraries/Image/AssetSourceResolver" {
  // AssetSourceResolver is a class — must be declared as such so it can be
  // used as both a value and a type in upstream expo-asset source files.
  class AssetSourceResolver {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export default AssetSourceResolver;
  export type ResolvedAssetSource = any;
}

declare module "invariant" {
  const _: (cond: any, message?: string) => void;
  export = _;
}
