import { ImageSourcePropType } from "react-native";

// Interface for TypeScript
interface Session {
  id: number;
  title: string;
  description: string;
  image: ImageSourcePropType | undefined;
}

// Arrays of sessions
export const sessions: Session[] = [
  {
    id: 1,
    title: "Forest Path",
    description: "Mindful walking through nature",
    image: require("@/assets/sessions/forest-path.png"),
  },
  {
    id: 2,
    title: "Mountain View",
    description: "Grounding mountain meditation practice",
    image: require("@/assets/sessions/mountain-view.png"),
  },
  {
    id: 3,
    title: "Ocean Waves",
    description: "Calming waves meditation session",
    image: require("@/assets/sessions/ocean-waves.png"),
  },
  {
    id: 4,
    title: "Sunrise Sky",
    description: "Morning mindfulness practice",
    image: require("@/assets/sessions/sunrise.png"),
  },
  {
    id: 5,
    title: "Zen Stones",
    description: "Focused balance meditation",
    image: require("@/assets/sessions/zen-stones.png"),
  },
];
