import { View, Text, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants'
import AuthHeader from '@/components/AuthHeader'
import InputBox from '@/components/InputBox'
import Button from '@/components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Controller, useForm} from 'react-hook-form'
import { router } from 'expo-router'
import Header from '@/components/Header'

const registerData = [
  { key: "email", label: "Email", placeholder: "E.g john@chomsky.com" },
  { key: "password", label: "Password", placeholder: "Enter your password" }
];

async function onSubmit() {

}
const signin = () => {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: "",
      password: ""
    },
  });
  return (
    <SafeAreaView style={{backgroundColor: colors.light.background_black, flex: 1, paddingHorizontal: 16}}>
      <Header onPress={() => router.replace("/(onboarding)")} title='Let’s sign you in' message='You can enter your email and password below'/>
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
              <Text style={{textAlign: "center", color: "#fff", marginVertical: 1}}>Don't have an account. </Text>
              <Pressable onPress={() => router.navigate("/(auth)/signup")}>
                <Text style={{textAlign: "center", color: colors.light.primary}}>Signup</Text>
              </Pressable>
            </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default signin