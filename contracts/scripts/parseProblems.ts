import { readFileSync, writeFileSync } from "fs";

const FENRegExp: RegExp =
    /^((([pnbrqkPNBRQK1-8]{1,8})\/?){8})\s+(b|w)\s+(-|K?Q?k?q?)\s+(-|[a-h][3-6])\s+(\d+)\s+(\d+)\s*/gim;
const FirstMove: RegExp = /1\.+\s[^\s]+/gim;

export function parseProblems() {
    let output: any[] = [];
    const rawData = readFileSync("./scripts/set1.txt", "utf-8");
    let result;
    while ((result = FENRegExp.exec(rawData)) !== null) {
        const fen = result[0].trim();
        const before = rawData.substring(0, result.index);
        const after = rawData.substring(result.index);
        const winningMove = [...after.matchAll(FirstMove)][0]
            .toString()
            .split(" ")[1]
            .trim();
        const description = before.split("\n\n").slice(-1)[0].trim();
        output.push([fen, winningMove, description]);
    }
    const filename = `puzzleSet_${new Date().toJSON().slice(0, 10)}.json`;
    writeFileSync(`./data/${filename}`, JSON.stringify(output), "utf8");
}
