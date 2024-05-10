import { createSystem } from "frog/ui";

export const {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  vars,
  Columns,
  Column,
} = createSystem({
  colors: {
    text: "#000",
    background: "#E6FA04",
    heading: "#000",
    subtext: "#777",
    username: "#000",
    red: "#FF0000",
  },
  fonts: {
    default: [
      {
        name: "Inter",
        source: "google",
        weight: 200,
      },
    ],
    pixelated: [
      {
        name: "Press Start 2P",
        source: "google",
      },
    ],
  },
});
