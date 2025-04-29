import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const LocationSvg = ({ color }: { color: string}) => (
  <Svg
    width={19}
    height={25}
    viewBox="0 0 19 25"
    fill="none"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.09091 0C4.07045 0 0 4.19766 0 9.375C0 13.2953 7.57955 25.0086 9.09091 25C10.5788 25.0086 18.1818 13.2422 18.1818 9.375C18.1818 4.19766 14.1114 0 9.09091 0Z"
      fill={color}
    />
    <Rect
      x={13.3441}
      y={7.83252}
      width={2.76449}
      height={8.29346}
      rx={1.38224}
      transform="rotate(90 13.3441 7.83252)"
      fill="#F9F9F9"
    />
    <Rect
      x={10.5796}
      y={13.3613}
      width={2.76449}
      height={8.29346}
      rx={1.38224}
      transform="rotate(-180 10.5796 13.3613)"
      fill="#F9F9F9"
    />
  </Svg>
);
export default LocationSvg;
