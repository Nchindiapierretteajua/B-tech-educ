// This file tells TypeScript how to handle image imports (e.g., .jpg, .png)
// It allows us to import image files directly into our .tsx components.

declare module '*.jpg' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.png' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}
