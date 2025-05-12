import { View, Text, ScrollView, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants'
import AuthHeader from '@/components/AuthHeader'
import InputBox from '@/components/InputBox'
import Button from '@/components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Controller, useForm} from 'react-hook-form'
import { router } from 'expo-router'
// import {
//   GoogleSignin,
//   GoogleSigninButton,
// } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   webClientId: process.env.EXPO_PUBLIC_WEB_ID,
//   scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//   forceCodeForRefreshToken: false,
//   iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
// });

const registerData = [
  { key: "firstname", label: "Firstname", placeholder: "E.g John" },
  { key: "lastname", label: "Lastname", placeholder: "E.g Doe" },
  { key: "email", label: "Email", placeholder: "E.g john@chomsky.com" },
  { key: "mobile", label: "Mobile", placeholder: "E.g +2348165918482" },
  { key: "password", label: "Password", placeholder: "Enter your password" },
];

async function onSubmit() {

}
const signup = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: ""
  });
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
    },
  });
  return (
    <SafeAreaView style={{backgroundColor: colors.light.background_black, flex: 1, paddingHorizontal: 16}}>
      <AuthHeader/>

      <KeyboardAwareScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? '100%' : '0%' }}
        keyboardShouldPersistTaps="handled"
        >
            { registerData.map((item: any) => (
          <Controller
            key={item.key}
            control={control}
            name={item.key}
            rules={item.key === "email"
              ? {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Invalid email",
                  },
                }
              : item.key === "password"
              ? {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                }
              : registerData.map(data => data.key).includes(item.key)
                ? { required: "*" }
                : {}
            }
            render={({ field: { onChange, onBlur, value } }) => (
          <InputBox
            onBlur={onBlur}
            disabled={item.key === "type"}
            value={value}
            label={item.label}
            placeholder={item.placeholder}
            onChangeText={onChange}
            error={errors[item.key]?.message}
            containerStyle={{marginBottom: 10}}
            />
        )}
          />
            ))}
          <View style={{ marginVertical: 8 }}>
            <Button
              onPress={handleSubmit(onSubmit)}
              type="normal"
              color={colors.light.primary}
              textColor="#000"
              title={loading ? "Loading..." : "Sign Up"}
            />
          </View>
          <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "center"}}>
              <Text style={{textAlign: "center", color: "#fff", marginVertical: 1}}>Already have an account. </Text>
              <Pressable onPress={() => router.navigate("/(auth)/signin")}>
                <Text style={{textAlign: "center", color: colors.light.primary}}>Login</Text>
              </Pressable>
            </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default signup