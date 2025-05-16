import { cssInterop } from "nativewind";
import { StyleProp, View, ViewStyle } from "react-native";
import Svg, { SvgProps, Path, G, Circle } from "react-native-svg";
import { twMerge } from "tailwind-merge";

interface MoodProps extends SvgProps {
  fillColor?: string;
  fillOpacity?: number;
}

const Mood1 = ({ fillColor, fillOpacity, ...rest }: MoodProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" {...rest}>
    <Circle
      cx="48"
      cy="48"
      r="48"
      fill={fillColor ?? "#DF5338"}
      fillOpacity={fillOpacity}
    />
    <Path
      fill="#000"
      opacity={0.6}
      d="M47.244 59.055c-15.223 0-25.29 10.143-25.29 10.143a2.363 2.363 0 0 0 0 3.336 2.362 2.362 0 0 0 3.336 0s8.83-8.755 21.954-8.755c13.123 0 21.954 8.755 21.954 8.755a2.362 2.362 0 0 0 3.337 0 2.362 2.362 0 0 0 0-3.336s-10.068-10.143-25.29-10.143ZM28.346 37.795a4.724 4.724 0 1 0 0 9.45 4.724 4.724 0 0 0 0-9.45ZM66.142 37.795a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449Z"
    />
  </Svg>
);

const Mood2 = ({ fillColor, fillOpacity, ...rest }: MoodProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" {...rest}>
    <Circle
      cx="48"
      cy="48"
      r="48"
      fill={fillColor ?? "#FD8D33"}
      fillOpacity={fillOpacity}
    />
    <G fill="#000" opacity={0.6}>
      <Path d="M47.732 59.055c-14.698 0-24.677 4.976-24.677 4.976a2.363 2.363 0 0 0-1.056 3.166 2.362 2.362 0 0 0 3.167 1.056s8.918-4.474 22.566-4.474c13.649 0 22.567 4.474 22.567 4.474a2.363 2.363 0 0 0 3.167-1.056 2.363 2.363 0 0 0-1.056-3.166s-9.98-4.976-24.678-4.976ZM28.835 33.07a4.724 4.724 0 1 0 0 9.45 4.724 4.724 0 0 0 0-9.45ZM66.63 33.07a4.724 4.724 0 1 0 0 9.45 4.724 4.724 0 0 0 0-9.45Z" />
    </G>
  </Svg>
);

const Mood3 = ({ fillColor, fillOpacity, ...rest }: MoodProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" {...rest}>
    <Circle
      cx="48"
      cy="48"
      r="48"
      fill={fillColor ?? "#FFD335"}
      fillOpacity={fillOpacity}
    />
    <G fill="#000" opacity={0.6}>
      <Path d="M24.598 59.055a2.362 2.362 0 0 0 0 4.724H71.843a2.362 2.362 0 1 0 0-4.724H24.597ZM29.323 28.346a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449ZM67.118 28.346a4.725 4.725 0 1 0 0 9.45 4.725 4.725 0 0 0 0-9.45Z" />
    </G>
  </Svg>
);

const Mood4 = ({ fillColor, fillOpacity, ...rest }: MoodProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" {...rest}>
    <Circle
      cx="48"
      cy="48"
      r="48"
      fill={fillColor ?? "#84C438"}
      fillOpacity={fillOpacity}
    />
    <G fill="#000" opacity={0.6}>
      <Path d="M72.076 49.724a2.363 2.363 0 0 0-1.8.133s-8.92 4.474-22.567 4.474c-13.649 0-22.567-4.474-22.567-4.474a2.362 2.362 0 0 0-3.294 2.858 2.362 2.362 0 0 0 1.183 1.365s9.98 4.975 24.678 4.975 24.677-4.975 24.677-4.975a2.362 2.362 0 0 0-.31-4.356ZM28.811 23.622a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449ZM66.606 23.622a4.724 4.724 0 1 0 0 9.449 4.724 4.724 0 0 0 0-9.449Z" />
    </G>
  </Svg>
);

const Mood5 = ({ fillColor, fillOpacity, ...rest }: MoodProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" {...rest}>
    <Circle
      cx="48"
      cy="48"
      r="48"
      fill={fillColor ?? "#2BA056"}
      fillOpacity={fillOpacity}
    />
    <G fill="#000" opacity={0.6}>
      <Path d="M23.83 40.276a2.36 2.36 0 0 0-1.5 2.99s1.386 4.094 5.3 8.009c3.915 3.914 10.527 7.78 20.567 7.78 10.04 0 16.651-3.866 20.566-7.78 3.914-3.915 5.3-8.01 5.3-8.01a2.36 2.36 0 0 0-1.499-2.99 2.363 2.363 0 0 0-2.99 1.5s-.976 2.99-4.148 6.163c-3.172 3.172-8.37 6.393-17.23 6.393-8.857 0-14.056-3.22-17.228-6.393-3.173-3.172-4.15-6.164-4.15-6.164a2.361 2.361 0 0 0-2.989-1.498ZM29.3 18.898a4.724 4.724 0 1 0 0 9.448 4.724 4.724 0 0 0 0-9.448ZM67.094 18.898a4.725 4.725 0 1 0 0 9.449 4.725 4.725 0 0 0 0-9.45Z" />
    </G>
  </Svg>
);

const Moods = [Mood1, Mood2, Mood3, Mood4, Mood5];

export type MoodNumber = 1 | 2 | 3 | 4 | 5;

const CircleWind = cssInterop(Circle, {
  className: {
    target: false,
    nativeStyleToProp: {
      color: "fill",
    },
  },
});

export function MoodFace({
  mood,
  className,
  iconClassName,
}: {
  mood: MoodNumber | null | undefined;
  className?: string;
  iconClassName?: string;
}) {
  let Mood: React.FC<MoodProps>;
  if (mood === null || mood === undefined) {
    Mood = ({ fillColor, fillOpacity, ...rest }: MoodProps) => (
      <Svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" {...rest}>
        <CircleWind
          cx="48"
          cy="48"
          r="48"
          className="text-base-content"
          fillOpacity={fillOpacity ?? 0.2}
        />
      </Svg>
    );
  } else {
    Mood = Moods[mood - 1];
  }

  const MoodWind = cssInterop(Mood, {
    className: {
      target: false,
      nativeStyleToProp: {
        color: "fillColor",
        opacity: "fillOpacity",
      },
    },
  });

  return (
    <View className={twMerge("size-16", className)}>
      <MoodWind className={iconClassName} />
    </View>
  );
}
