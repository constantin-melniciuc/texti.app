import React from "react";
import { SvgCss } from "react-native-svg";
import { View } from "react-native";

import PlusSign from "../../../assets/icons/chat/plus-square.svg";

import Icon00001 from "../../../assets/icons/chat/icon00001.svg";
import Icon00002 from "../../../assets/icons/chat/icon00002.svg";
import Icon00003 from "../../../assets/icons/chat/icon00003.svg";
import Icon00004 from "../../../assets/icons/chat/icon00004.svg";
import Icon00005 from "../../../assets/icons/chat/icon00005.svg";
import Icon00006 from "../../../assets/icons/chat/icon00006.svg";
import Icon00007 from "../../../assets/icons/chat/icon00007.svg";
import Icon00008 from "../../../assets/icons/chat/icon00008.svg";
import Icon00009 from "../../../assets/icons/chat/icon00009.svg";
import Icon00010 from "../../../assets/icons/chat/icon00010.svg";
import Icon00011 from "../../../assets/icons/chat/icon00011.svg";
import Icon00012 from "../../../assets/icons/chat/icon00012.svg";
import Icon00013 from "../../../assets/icons/chat/icon00013.svg";
import Icon00014 from "../../../assets/icons/chat/icon00014.svg";
import Icon00015 from "../../../assets/icons/chat/icon00015.svg";
import Icon00016 from "../../../assets/icons/chat/icon00016.svg";
import Icon00017 from "../../../assets/icons/chat/icon00017.svg";
import Icon00018 from "../../../assets/icons/chat/icon00018.svg";
import Icon00019 from "../../../assets/icons/chat/icon00019.svg";
import Icon00020 from "../../../assets/icons/chat/icon00020.svg";
import Icon00021 from "../../../assets/icons/chat/icon00021.svg";
import Icon00022 from "../../../assets/icons/chat/icon00022.svg";
import Icon00023 from "../../../assets/icons/chat/icon00023.svg";
import Icon00024 from "../../../assets/icons/chat/icon00024.svg";
import Icon00025 from "../../../assets/icons/chat/icon00025.svg";
import Icon00026 from "../../../assets/icons/chat/icon00026.svg";
import Icon00027 from "../../../assets/icons/chat/icon00027.svg";
import Icon00028 from "../../../assets/icons/chat/icon00028.svg";
import Icon00029 from "../../../assets/icons/chat/icon00029.svg";
import Icon00030 from "../../../assets/icons/chat/icon00030.svg";
import Icon00031 from "../../../assets/icons/chat/icon00031.svg";
import Icon00032 from "../../../assets/icons/chat/icon00032.svg";
import Icon00033 from "../../../assets/icons/chat/icon00033.svg";
import Icon00034 from "../../../assets/icons/chat/icon00034.svg";
import Icon00035 from "../../../assets/icons/chat/icon00035.svg";
import Icon00036 from "../../../assets/icons/chat/icon00036.svg";
import Icon00037 from "../../../assets/icons/chat/icon00037.svg";
import Icon00038 from "../../../assets/icons/chat/icon00038.svg";
import Icon00039 from "../../../assets/icons/chat/icon00039.svg";
import Icon00040 from "../../../assets/icons/chat/icon00040.svg";
import Icon00041 from "../../../assets/icons/chat/icon00041.svg";
import Icon00042 from "../../../assets/icons/chat/icon00042.svg";
import Icon00043 from "../../../assets/icons/chat/icon00043.svg";
import Icon00044 from "../../../assets/icons/chat/icon00044.svg";
import Icon00045 from "../../../assets/icons/chat/icon00045.svg";
import Icon00046 from "../../../assets/icons/chat/icon00046.svg";
import Icon00047 from "../../../assets/icons/chat/icon00047.svg";
import Icon00048 from "../../../assets/icons/chat/icon00048.svg";
import Icon00049 from "../../../assets/icons/chat/icon00049.svg";
import Icon00050 from "../../../assets/icons/chat/icon00050.svg";

const icons = [
  Icon00001,
  Icon00002,
  Icon00003,
  Icon00004,
  Icon00005,
  Icon00006,
  Icon00007,
  Icon00008,
  Icon00009,
  Icon00010,
  Icon00011,
  Icon00012,
  Icon00013,
  Icon00014,
  Icon00015,
  Icon00016,
  Icon00017,
  Icon00018,
  Icon00019,
  Icon00020,
  Icon00021,
  Icon00022,
  Icon00023,
  Icon00024,
  Icon00025,
  Icon00026,
  Icon00027,
  Icon00028,
  Icon00029,
  Icon00030,
  Icon00031,
  Icon00032,
  Icon00033,
  Icon00034,
  Icon00035,
  Icon00036,
  Icon00037,
  Icon00038,
  Icon00039,
  Icon00040,
  Icon00041,
  Icon00042,
  Icon00043,
  Icon00044,
  Icon00045,
  Icon00046,
  Icon00047,
  Icon00048,
  Icon00049,
  Icon00050,
];

const customIcons = {
  PlusSign,
};

type IRobotoAvatar = {
  index?: number;
  size?: number;
  icon?: keyof typeof customIcons;
};
export default function RobotAvatar({
  index = 0,
  size = 64,
  icon,
}: IRobotoAvatar) {
  const availableIndex = index % icons.length;
  return (
    <View style={{ width: size, height: size }}>
      {icon ? (
        <SvgCss
          width={size.toString()}
          height={size.toString()}
          xml={customIcons[icon]}
        />
      ) : (
        <SvgCss
          width={size.toString()}
          height={size.toString()}
          xml={icons[availableIndex]}
        />
      )}
    </View>
  );
}
