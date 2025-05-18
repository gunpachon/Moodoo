import { View, Text, TextInput, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { useTheme } from "@/hooks/useTheme";
import { vars } from "nativewind";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      Alert.alert("Success", "Account created successfully");
      router.push("/auth/login");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View
      className="flex-1 justify-center bg-base-100 px-6"
      style={vars(theme)}
    >
      <Text className="text-4xl font-bold text-center text-base-content mb-2">
        Join us
      </Text>
      <Text className="text-lg text-center text-base-content mb-14">
        Create a new account
      </Text>

      <View className="space-y-4">
        <TextInput
          className="bg-base-200 text-base-content px-6 py-3 rounded-full mb-2 border border-base-content-soft text-lg"
          placeholder="Nickname"
          placeholderTextColor="#9ca3af"
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          className="bg-base-200 text-base-content px-6 py-3 rounded-full mb-2 border border-base-content-soft text-lg"
          placeholder="Username"
          placeholderTextColor="#9ca3af"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="bg-base-200 text-base-content px-6 py-3 rounded-full border border-base-content-soft text-lg"
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <PressableWithOpacity
        className="bg-secondary mt-16 py-3 rounded-full items-center"
        onPress={handleSignup}
        style={vars(theme)}
      >
        <Text className="text-lg font-semibold text-white">Sign up</Text>
      </PressableWithOpacity>

      <View className="mt-6 flex-row justify-center">
        <Text className="text-base-content text-lg">
          Already have an account?{" "}
        </Text>
        <Link href="/auth/login" className="text-secondary text-lg font-medium">
          Log in
        </Link>
      </View>
    </View>
  );
}
