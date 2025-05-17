import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MoodFace, MoodNumber} from '@/components/ui/MoodFace'
import { PressableWithOpacity } from '@/components/PressableWithOpacity';
import { useTheme } from '@/hooks/useTheme';
import { vars } from 'nativewind';

export default function WelcomeScreen() {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center justify-center bg-base-100 px-6" style={vars(theme)}>
      <MoodFace mood={4} className="size-48 mb-12" iconClassName="text-yellow-400"></MoodFace>
      <Text className="text-6xl font-bold text-base-content">MOODOO</Text>
      <Text className="text-xl font-medium text-base-content mb-40">Sign up or login to continue</Text>

      <View className="w-full space-y-4">
        <Link href="/auth/login" asChild>
          <PressableWithOpacity className="border-primary py-3 rounded-full items-center bg-secondary mb-3">
            <Text className="text-base font-semibold text-secondary-content">Log In</Text>
          </PressableWithOpacity>
        </Link>

        <Link href="/auth/signup" asChild>
          <PressableWithOpacity className="border bg-base-200 border-base-content py-3 rounded-full items-center">
            <Text className="text-base-content text-base font-semibold">Sign Up</Text>
          </PressableWithOpacity>
        </Link>
      </View>
    </View>
  );
}
