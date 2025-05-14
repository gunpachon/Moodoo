import { useThemeColor } from "@/hooks/useThemeColor";
import { Image, StyleProp, View, ViewProps, ViewStyle } from "react-native";
import Svg, { SvgProps, Path, G, Circle } from "react-native-svg";

interface MoodProps extends SvgProps {
  size: number;
}

const Mood1 = ({ size, ...rest }: MoodProps) => (
  <Svg width={size} height={size} viewBox="0 0 96 96" fill="none" {...rest}>
    {/* <Path
      fill="#DF5338"
      d="M94.488 47.244a47.244 47.244 0 1 1-94.489 0 47.244 47.244 0 0 1 94.49 0Z"
    /> */}
    <Circle cx="48" cy="48" r="48" fill="#DF5338" />
    <Path
      fill="#000"
      d="M47.244 59.055c-15.223 0-25.29 10.143-25.29 10.143a2.363 2.363 0 0 0 0 3.336 2.362 2.362 0 0 0 3.336 0s8.83-8.755 21.954-8.755c13.123 0 21.954 8.755 21.954 8.755a2.362 2.362 0 0 0 3.337 0 2.362 2.362 0 0 0 0-3.336s-10.068-10.143-25.29-10.143ZM28.346 37.795a4.724 4.724 0 1 0 0 9.45 4.724 4.724 0 0 0 0-9.45ZM66.142 37.795a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449Z"
    />
  </Svg>
);

const Mood2 = ({ size, ...rest }: MoodProps) => (
  <Svg width={size} height={size} viewBox="0 0 96 96" fill="none" {...rest}>
    {/* <Path
      fill="#FD8D33"
      d="M94.976 47.244a47.243 47.243 0 0 1-80.65 33.407 47.244 47.244 0 1 1 80.65-33.407Z"
    /> */}
    <Circle cx="48" cy="48" r="48" fill="#FD8D33" />
    <G fill="#000" opacity={0.6}>
      <Path d="M47.732 59.055c-14.698 0-24.677 4.976-24.677 4.976a2.363 2.363 0 0 0-1.056 3.166 2.362 2.362 0 0 0 3.167 1.056s8.918-4.474 22.566-4.474c13.649 0 22.567 4.474 22.567 4.474a2.363 2.363 0 0 0 3.167-1.056 2.363 2.363 0 0 0-1.056-3.166s-9.98-4.976-24.678-4.976ZM28.835 33.07a4.724 4.724 0 1 0 0 9.45 4.724 4.724 0 0 0 0-9.45ZM66.63 33.07a4.724 4.724 0 1 0 0 9.45 4.724 4.724 0 0 0 0-9.45Z" />
    </G>
  </Svg>
);

const Mood3 = ({ size, ...rest }: MoodProps) => (
  <Svg width={size} height={size} viewBox="0 0 96 96" fill="none" {...rest}>
    {/* <Path
      fill="#FFD335"
      d="M95.465 47.244a47.243 47.243 0 0 1-80.651 33.407 47.244 47.244 0 1 1 80.65-33.407Z"
    /> */}
    <Circle cx="48" cy="48" r="48" fill="#FFD335" />
    <G fill="#000" opacity={0.6}>
      <Path d="M24.598 59.055a2.362 2.362 0 0 0 0 4.724H71.843a2.362 2.362 0 1 0 0-4.724H24.597ZM29.323 28.346a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449ZM67.118 28.346a4.725 4.725 0 1 0 0 9.45 4.725 4.725 0 0 0 0-9.45Z" />
    </G>
  </Svg>
);

const Mood4 = ({ size, ...rest }: MoodProps) => (
  <Svg width={size} height={size} viewBox="0 0 96 96" fill="none" {...rest}>
    {/* <Path
      fill="#84C438"
      d="M94.953 47.244a47.244 47.244 0 1 1-94.49 0 47.244 47.244 0 0 1 94.49 0Z"
    /> */}
    <Circle cx="48" cy="48" r="48" fill="#84C438" />
    <G fill="#000" opacity={0.6}>
      <Path d="M72.076 49.724a2.363 2.363 0 0 0-1.8.133s-8.92 4.474-22.567 4.474c-13.649 0-22.567-4.474-22.567-4.474a2.362 2.362 0 0 0-3.294 2.858 2.362 2.362 0 0 0 1.183 1.365s9.98 4.975 24.678 4.975 24.677-4.975 24.677-4.975a2.362 2.362 0 0 0-.31-4.356ZM28.811 23.622a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449ZM66.606 23.622a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449Z" />
    </G>
  </Svg>
);

const Mood5 = ({ size, ...rest }: MoodProps) => (
  <Svg width={size} height={size} viewBox="0 0 96 96" fill="none" {...rest}>
    {/* <Path
      fill="#2BA056"
      d="M95.44 47.244a47.244 47.244 0 1 1-96 0 47.244 47.244 0 0 1 96 0Z"
    /> */}
    <Circle cx="48" cy="48" r="48" fill="#2BA056" />
    <G fill="#000" opacity={0.6}>
      <Path d="M23.83 40.276a2.36 2.36 0 0 0-1.5 2.99s1.386 4.094 5.3 8.009c3.915 3.914 10.527 7.78 20.567 7.78 10.04 0 16.651-3.866 20.566-7.78 3.914-3.915 5.3-8.01 5.3-8.01a2.36 2.36 0 0 0-1.499-2.99 2.363 2.363 0 0 0-2.99 1.5s-.976 2.99-4.148 6.163c-3.172 3.172-8.37 6.393-17.23 6.393-8.857 0-14.056-3.22-17.228-6.393-3.173-3.172-4.15-6.164-4.15-6.164a2.361 2.361 0 0 0-2.989-1.498ZM29.3 18.898a4.724 4.724 0 1 0 0 9.448 4.724 4.724 0 0 0 0-9.448ZM67.094 18.898a4.725 4.725 0 1 0 0 9.449 4.725 4.725 0 0 0 0-9.45Z" />
    </G>
  </Svg>
);

const Moods = [Mood1, Mood2, Mood3, Mood4, Mood5];

type MoodNumber = 1 | 2 | 3 | 4 | 5;

export function MoodFace({
  mood,
  size = 64,
  style,
}: {
  mood: MoodNumber | null | undefined;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const iconColor = useThemeColor("icon");

  if (mood === null || mood === undefined) {
    return (
      <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
        <Circle cx="48" cy="48" r="48" fill={iconColor} opacity={0.5} />
      </Svg>
    );
  } else {
    const Mood = Moods[mood - 1];
    return <Mood size={size} style={style} />;
  }
}
