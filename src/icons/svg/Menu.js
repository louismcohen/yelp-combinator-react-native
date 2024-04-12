import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgMenu = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <Path d="M0 15v482c0 8.285 6.715 15 15 15h226V0H15C6.715 0 0 6.715 0 15m60.5 80c0-8.285 6.715-15 15-15s15 6.715 15 15v141c0 8.27 6.73 15 15 15h15V95c0-8.285 6.715-15 15-15s15 6.715 15 15v156h15c8.27 0 15-6.73 15-15V95c0-8.285 6.715-15 15-15s15 6.715 15 15v141c0 24.813-20.187 45-45 45h-15v136c0 8.285-6.715 15-15 15s-15-6.715-15-15V281h-15c-24.812 0-45-20.187-45-45zM341.5 170h70v52h-70zm0 0" />
    <Path d="M497 0H271v512h226c8.285 0 15-6.715 15-15V15c0-8.285-6.715-15-15-15m-70.5 432h-100c-8.285 0-15-6.715-15-15s6.715-15 15-15h100c8.285 0 15 6.715 15 15s-6.715 15-15 15m0-60h-100c-8.285 0-15-6.715-15-15s6.715-15 15-15h100c8.285 0 15 6.715 15 15s-6.715 15-15 15m0-60h-100c-8.285 0-15-6.715-15-15s6.715-15 15-15h100c8.285 0 15 6.715 15 15s-6.715 15-15 15m15-75c0 8.285-6.715 15-15 15h-100c-8.285 0-15-6.715-15-15v-82c0-8.285 6.715-15 15-15h100c8.285 0 15 6.715 15 15zm-15-127h-100c-8.285 0-15-6.715-15-15s6.715-15 15-15h100c8.285 0 15 6.715 15 15s-6.715 15-15 15m0 0" />
  </Svg>
);
export default SvgMenu;