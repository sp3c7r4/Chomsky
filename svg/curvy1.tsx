import * as React from "react";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
const {width} = Dimensions.get('window')
console.log(width)
const CurvyLine1 = (props: any) => (
  <Svg
    width={width}
    height={156}
    viewBox={`0 0 ${width} 156`}
    fill="none"
    {...props}
  >
    <Path
      d="M-34.8999 154.809C56.5052 54.3177 266.742 21.3059 306.667 42.6856C357.715 70.021 322.484 106.575 297.062 96.334C280.413 89.6271 275.091 66.4207 290.409 48.918C302.715 34.8573 364.078 -2.90296 399.378 2.1054"
      stroke="#32B582"
      strokeWidth={1.4}
    />
  </Svg>
);
export default CurvyLine1;
