import * as React from "react";
import Svg, { G, Path, Circle, ClipPath, Image as SvgImage, SvgProps } from "react-native-svg";

type UserPuckProps = SvgProps & {
  // Add any additional props here if needed
};

function UserPuck({image, ...props}) {
  return (
    <Svg
      viewBox="0 0 198.29 237.79"
      width={70}
      height={70}
      {...props}
    >
      <G id="Layer_2" data-name="Layer 2">
        <G id="Layer_1-2" data-name="Layer 1">
          <Path
            d="M99.15 237.79L55.84 162.79 142.45 162.79 99.15 237.79z"
            fill="#32B582"
          />
          {/* <ClipPath id="circleClip">
            <Circle cx={99.15} cy={99.15} r={99.15} />
          </ClipPath>
          <G clipPath="url(#circleClip)">
          </G> */}
          {/* Replace the href below with your image URL or require() */}
          {/* <Circle cx={99.15} cy={99.15} r={99.15} fill="none" stroke="black" strokeWidth={2} /> */}
          <ClipPath id="circleClip">
            <Circle cx={99.15} cy={99.15} r={99.15} />
          </ClipPath>
          <SvgImage
            x={0}
            y={0}
            width={198.3}
            height={198.3}
            href={image}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#circleClip)"
          />
          <Circle
            cx={99.15}
            cy={99.15}
            r={99.15}
            fill="none"
            stroke="#32B582"
            strokeWidth={5}
            pointerEvents="none"
          />
        </G>
      </G>
    </Svg>
  );
}

export default UserPuck;
