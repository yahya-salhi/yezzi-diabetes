import Svg, { Path, Circle, G, Line, Rect } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

function useDefaults({ size = 24, color = "#6B6E6D", strokeWidth = 1.8 }: Props) {
  return { size, color, strokeWidth };
}

export function ReadingsIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C10 7.5 7 10 7 14c0 2.76 2.24 5 5 5s5-2.24 5-5c0-4-3-6.5-5-11z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 14l1.5 1.5L15 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function FoodIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3v6a4 4 0 004 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 3v18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 6V3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 3v6a4 4 0 01-4 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 21h18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function WorkoutIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="8"
        width="4"
        height="8"
        rx="1.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Rect
        x="18"
        y="8"
        width="4"
        height="8"
        rx="1.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Line
        x1="6"
        y1="10"
        x2="18"
        y2="10"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="6"
        y1="14"
        x2="18"
        y2="14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SettingsIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CameraIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="13"
        r="4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function FlameIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c-2 5-6 7-6 11a6 6 0 1012 0c0-4-4-6-6-11z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 13a3 3 0 100 6 3 3 0 000-6z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PlusIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CheckCircleIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClockIcon(props: Props) {
  const { size, color, strokeWidth } = useDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M12 6v6l4 2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
