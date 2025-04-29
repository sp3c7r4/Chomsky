import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, DimensionValue, StyleProp, ViewStyle, TextStyle } from "react-native";
import { colors, fontsizes } from "@/constants";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  type?: "outline" | "normal";
  color?: string;
  textColor?: string;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  icon?: React.ReactNode; // Accepts any React Node for flexibility
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = "normal",
  color = colors.light.primary,
  textColor,
  width = "100%",
  height = 47,
  borderRadius = 10,
  icon,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: type === "normal" ? color : "transparent",
          borderColor: type === "outline" ? color : "transparent",
          borderWidth: type === "outline" ? 1 : 0,
          width,
          height,
          borderRadius,
        },
        style, // Allow custom styles to override defaults
        // {marginVertical: 10}
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: textColor || (type === "normal" ? "#fff" : color),
          },
          textStyle, // Allow custom text styles to override defaults
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 3,
  },
  iconContainer: {
    marginRight: 8, // Space between icon and text
  },
  text: {
    fontFamily: "Satoshi-Medium",
    fontSize: fontsizes.button,
  },
});

export default Button;