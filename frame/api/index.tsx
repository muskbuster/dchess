import { Button, Frog } from "frog";
import { handle } from "frog/vercel";

/* devtools */
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";

import { Box, Heading, Text, Image, Columns, Column, vars } from "./ui.js";
import { findStatsByUsername } from "./database.js";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  ui: { vars },
  basePath: "/api",
});

app.frame("/", (c) => {
  return c.res({
    image: (
      <Box
        grow
        backgroundColor="background"
        padding="32"
        justifyContent="center"
      >
        <Columns gap="10" grow>
          <Column
            width="1/5"
            alignItems="flex-end"
            justifyContent="center"
            paddingBottom="20"
            paddingRight="8"
          >
            <Image src="/logo.png" width="96" />
          </Column>
          <Column width="4/5" alignItems="flex-start" justifyContent="center">
            <Heading color="heading" size="48" font="pixelated">
              Virtuoso Club
            </Heading>
          </Column>
        </Columns>
        <Text size="14" font="default" align="center">
          Tickle your brain with on-chain chess puzzles
        </Text>
      </Box>
    ),
  });
});

app.frame("/stats/:username", async (c) => {
  const username = c.req.param("username");
  const stats = await findStatsByUsername(username);
  // fetch stats from db
  const points = stats.points;
  const ratings = stats.ratings;
  const puzzlesSolved = stats.solves;
  const puzzlesAttempted = stats.attempts;
  return c.res({
    image: (
      <Box
        grow
        backgroundColor="background"
        padding="32"
        justifyContent="center"
      >
        <Columns gap="10" grow>
          <Column
            width="1/5"
            alignItems="flex-end"
            justifyContent="center"
            paddingBottom="20"
            paddingRight="8"
          >
            <Image src="/logo.png" width="96" />
          </Column>
          <Column
            width="4/5"
            alignItems="flex-start"
            gap="10"
            justifyContent="center"
          >
            <Box paddingBottom="10">
              <Text
                size="32"
                font="pixelated"
                align="center"
                color="username"
                tracking="-1"
              >
                {username}
              </Text>
            </Box>
            <Text size="12" font="pixelated" align="center">
              Solved: {puzzlesSolved}/{puzzlesAttempted}
            </Text>
            <Text size="12" font="pixelated" align="center">
              Ratings: {ratings}
            </Text>
            <Text size="12" font="pixelated" align="center" color="red">
              Points: {points}
            </Text>
          </Column>
        </Columns>
        <Text size="14" font="default" align="center" color="subtext">
          Tickle your brain with on-chain chess puzzles
        </Text>
      </Box>
    ),
    intents: [
      <Button.Redirect location="https://app.virtuoso.club/">
        Virtuoso Club
      </Button.Redirect>,
    ],
  });
});

if (import.meta.env?.MODE === "development") devtools(app, { serveStatic });
else devtools(app, { assetsPath: "/.frog" });

export const GET = handle(app);
export const POST = handle(app);
