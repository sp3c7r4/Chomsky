import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants'
import AuthHeader from '@/components/AuthHeader'
import InputBox from '@/components/InputBox'
import Button from '@/components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Controller, useForm} from 'react-hook-form'
import GoogleSignIn from '@/auth/Google'

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
      <Text>signup</Text>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ flex: 1}}>
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
          <View style={{ marginVertical: 10, marginBottom: 100 }}>
            <Button
              onPress={handleSubmit(onSubmit)}
              type="normal"
              color={colors.light.primary}
              textColor="#000"
              title={loading ? "Loading..." : "Sign Up"}
            />
          </View>
        </KeyboardAwareScrollView>
        <GoogleSignIn/>
    </SafeAreaView>
  )
}

export default signup