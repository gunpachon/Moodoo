import { View, Text, TextInput, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { PressableWithOpacity } from '@/components/PressableWithOpacity';
import { useTheme } from '@/hooks/useTheme';
import { vars } from 'nativewind';

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://172.20.10.2:5001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      Alert.alert('Success', 'Account created successfully');
      router.replace('/auth/login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <View className="flex-1 justify-center bg-base-100 px-6" style={vars(theme)}>
      <Text className="text-5xl font-bold text-center text-base-content mb-2">Join us</Text>
      <Text className="text-base text-center text-base-content mb-10">Create your new account</Text>

      <View className="space-y-4">
        <TextInput
          className="bg-base-200 text-base-content px-4 py-3 rounded-full mb-2"
          placeholder="Nickname"
          placeholderTextColor="#9ca3af"
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          className="bg-base-200 text-base-content px-4 py-3 rounded-full mb-2"
          placeholder="Username"
          placeholderTextColor="#9ca3af"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="bg-base-200 text-base-content px-4 py-3 rounded-full"
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
        <Text className="text-base font-semibold text-white">Sign Up</Text>
      </PressableWithOpacity>

      <View className="mt-6 flex-row justify-center">
        <Text className="text-base-content">Already have an account? </Text>
        <Link href="/auth/login" className="text-secondary font-medium">
          Log in
        </Link>
      </View>
    </View>
  );
}
