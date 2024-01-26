export declare const colors: readonly ["white", "black"];
export declare const files: readonly ["a", "b", "c", "d", "e", "f", "g", "h"];
export declare const ranks: readonly ["1", "2", "3", "4", "5", "6", "7", "8"];
export declare type File = (typeof files)[number];
export declare type Rank = (typeof ranks)[number];
export declare type Key = "a0" | `${File}${Rank}`;
export declare type Color = (typeof colors)[number];
export declare type Dests = Map<Key, Key[]>;
