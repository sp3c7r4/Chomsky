import React from "react";
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { colors, fontsizes } from "@/constants";

interface InputBoxProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

const InputBox: React.FC<InputBoxProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder = "",
  disabled = false,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, labelStyle]}>
          {label?.charAt(0).toUpperCase() + label?.slice(1).toLowerCase()}
        </Text>
        {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
      </View>

      {/* Input */}
      <View style={[styles.inputContainer, disabled && styles.disabledInput]}>
        <TextInput
          onBlur={onBlur}
          editable={!disabled}
          onChangeText={onChangeText}
          value={disabled ? value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase() : value}
          placeholder={placeholder}
          placeholderTextColor={"rgba(255,255,255,0.5)"}
          style={[styles.input, inputStyle, disabled && styles.disabledText]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    marginBottom: 5,
  },
  label: {
    fontSize: fontsizes.paragraph1,
    fontFamily: "Satoshi-Bold",
    color: colors.light.background_white,
  },
  error: {
    fontSize: 10,
    color: "red",
  },
  inputContainer: {
    height: 55,
    backgroundColor: "#383838",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    color: colors.light.background_white,
    fontFamily: "Satoshi-Medium",
    borderBottomWidth: 0,
  },
  disabledInput: {
    backgroundColor: "#2c2c2c",
  },
  disabledText: {
    color: colors.light.primary,
  },
});

export default InputBox;