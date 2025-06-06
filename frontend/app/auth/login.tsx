import { View, Text, TextInput, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { useTheme } from "@/hooks/useTheme";
import { vars } from "nativewind";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();

  const { token, setToken } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.access_token;

      setToken(token);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (token !== null) {
      router.dismissAll();
      router.replace("/(tabs)/home"); // Change to your app home route
    }
  }, [token]);

  return (
    <View
      className="flex-1 justify-center bg-base-100 px-6"
      style={vars(theme)}
    >
      <Text className="text-4xl font-bold text-center text-base-content mb-2">
        Welcome back
      </Text>
      <Text className="text-lg text-center text-base-content mb-10">
        Log in to your account
      </Text>

      <View className="space-y-4">
        <TextInput
          className="bg-base-200 text-base-content px-6 py-3 rounded-full mb-2 text-lg border border-base-content-soft"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="bg-base-200 text-base-content px-6 py-3 rounded-full mb-16 text-lg border border-base-content-soft"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <PressableWithOpacity
        className="bg-secondary mt-8 py-3 rounded-full items-center"
        style={vars(theme)}
        onPress={handleLogin}
      >
        <Text className="text-secondary-content font-semibold text-lg">
          Log in
        </Text>
      </PressableWithOpacity>

      <View className="mt-6 flex-row justify-center">
        <Text className="text-base-content text-lg">
          Don't have an account?{" "}
        </Text>
        <Link
          href="/auth/signup"
          className="text-lg text-secondary font-medium"
        >
          Sign up
        </Link>
      </View>
    </View>
  );
}
