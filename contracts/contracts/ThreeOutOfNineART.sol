// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IThreeOutOfNineART} from "./interfaces/IThreeOutOfNineART.sol";

import {Base64} from "./lib/Base64.sol";

/// @title A library that generates HTML art based on a modified version of fiveoutofnine
/// @author RnkSngh / 0xasdf / fiveoutofnine
/// @dev Understand the representations of the chess pieces, board, and moves very carefully before
/// using this library:
/// ======================================Piece Representation======================================
/// Each chess piece is defined with 4 bits as follows:
///     * The first bit denotes the color (0 means black; 1 means white).
///     * The last 3 bits denote the type:
///         | Bits | # | Type   |
///         | ---- | - | ------ |
///         | 000  | 0 | Empty  |
///         | 001  | 1 | Pawn   |
///         | 010  | 2 | Bishop |
///         | 011  | 3 | Rook   |
///         | 100  | 4 | Knight |
///         | 101  | 5 | Queen  |
///         | 110  | 6 | King   |
/// ======================================Board Representation======================================
/// The board is an 8x8 representation of a 6x6 chess board. For efficiency, all information is
/// bitpacked into a single uint256. Thus, unlike typical implementations, board positions are
/// accessed via bit shifts and bit masks, as opposed to array accesses. Since each piece is 4 bits,
/// there are 64 ``indices'' to access: # 256bit interger, 4 bits per piece each 4bits represents a slot on the board
///                                     63 62 61 60 59 58 57 56
///                                     55 54 53 52 51 50 49 48
///                                     47 46 45 44 43 42 41 40
///                                     39 38 37 36 35 34 33 32
///                                     31 30 29 28 27 26 25 24
///                                     23 22 21 20 19 18 17 16
///                                     15 14 13 12 11 10 09 08
///                                     07 06 05 04 03 02 01 00
/// All numbers in the figure above are in decimal representation.
/// For example, the piece at index 27 is accessed with ``(board >> (27 << 2)) & 0xF''.

/// 00... 0110 # Board with black king at index 00
/// 00... 0110 >> 0 << 2 & 1111
///  00... 0110 >> 0  =  00...0110
//// 00... 0110 << 2  -> 00 ... 01100
//// 00 ... 0000 1100 & (1111) -> 0000 1100
///
/// The top/bottom rows and left/right columns are treated as sentinel rows/columns for efficient
/// boundary validation (see {Chess-generateMoves} and {Chess-isValid}). i.e., (63, ..., 56),
/// (07, ..., 00), (63, ..., 07), and (56, ..., 00) never contain pieces. Every bit in those rows
/// and columns should be ignored, except for the last bit. The last bit denotes whose turn it is to
/// play (0 means black's turn; 1 means white's turn). e.g. a potential starting position:
///                                Black
///                       00 00 00 00 00 00 00 00                    Black
///                       00 03 02 05 06 02 03 00                 ♜ ♝ ♛ ♚ ♝ ♜
///                       00 01 01 01 01 01 01 00                 ♟ ♟ ♟ ♟ ♟ ♟
///                       00 00 00 00 00 00 00 00     denotes
///                       00 00 00 00 00 00 00 00    the board
///                       00 09 09 09 09 09 09 00                 ♙ ♙ ♙ ♙ ♙ ♙
///                       00 11 12 13 14 12 11 00                 ♖ ♘ ♕ ♔ ♘ ♖
///                       00 00 00 00 00 00 00 01                    White
///                                White
/// All numbers in the example above are in decimal representation.
/// ======================================Move Representation=======================================
/// Each move is allocated 12 bits. The first 6 bits are the index the piece is moving from, and the
/// last 6 bits are the index the piece is moving to. Since the index representing a square is at
/// most 54, 6 bits sufficiently represents any index (0b111111 = 63 > 54). e.g. 1243 denotes a move
/// from index 19 to 27 (1243 = (19 << 6) | 27).
///
/// Since the board is represented by a uint256, consider including ``using Chess for uint256''.
///
/// @notice Below details how the metadata and art are generated:
/// ==========================================Description===========================================
/// Token descriptions describe white's move in algebraic notation and black's move in algebraic
/// notation. If white's move results in checkmating black or a stalemate, the description will say
/// black resigned (for simplicity, stalemates are treated as checkmates). Since the engine always
/// plays black, and the player always plays white, white is indicated as ``Player'', and black is
/// indicated as ``fiveoutofnine''. Additionally, for every non game-ending turn, a string graphic
/// is generated after the moves' descriptions. An example:
///                             Player plays e4 rook captures e5 queen.
///                             6 · · ♜ · ♚ ♜
///                             5 · ♟ · · ♖ ♟
///                             4 ♟ ♙ ♟ ♙ * ♙
///                             3 ♙ · ♙ · · ·
///                             2 · · · · ♖ ·
///                             1 · ♘ · ♔ · ·
///                               a b c d e f
///
///                             fiveoutofnine resigns.
/// * indicates the square the piece moved from.
/// ==============================================Art===============================================
/// The art is generated as HTML code with in-line CSS (0 JS) according to the following table:
///  | Property       | Name      | Value/Description                       | Determination       |
///  | ============== | ========= | ======================================= | =================== |
///  | Dimension      | 1 × 1     | 1 × 1 pillars                           | Player moved king   |
///  | (6 traits)     | 2 × 2     | 2 × 2 pillars                           | Player moved rook   |
///  |                | 3 × 3     | 3 × 3 pillars                           | Engine moved bishop |
///  |                | 4 × 4     | 4 × 4 pillars                           | Player moved knight |
///  |                | 6 × 6     | 6 × 6 pillars                           | Player moved pawn   |
///  |                | 12 × 12   | 12 × 12 pillars                         | Player moved queen  |
///  | -------------- | --------- | --------------------------------------- | ------------------- |
///  | Height         | Plane     | 8px pillar height                       | 1 / 64 chance[^0]   |
///  | (5 traits)     | 1/4       | 98px pillar height                      | 10 / 64 chance[^0]  |
///  |                | 1/2       | 197px pillar height                     | 10 / 64 chance[^0]  |
///  |                | Cube      | 394px pillar height                     | 40 / 64 chance[^0]  |
///  |                | Infinite  | 1000px pillar height                    | 3 / 64 chance[^0]   |
///  | -------------- | --------- | --------------------------------------- | ------------------- |
///  | Gap[^1]        | None      | 0px gap between the pillars             | 4 / 16 chance[^0]   |
///  | (4 traits)     | Narrow    | 2px gap between the pillars             | 9 / 16 chance[^0]   |
///  |                | Wide      | 12px gap between the pillars            | 2 / 16 chance[^0]   |
///  |                | Ultrawide | 24px gap between the pillars            | 1 / 16 chance[^0]   |
///  | -------------- | --------- | --------------------------------------- | ------------------- |
///  | Color          | Uniform   | All faces are the same color            | 7 / 32 chance[^0]   |
///  | Generation[^2] | Shades    | Faces get darker anticlockwise          | 7 / 32 chance[^0]   |
///  | (6 traits)     | Tints     | Faces get lighter anticlockwise         | 7 / 32 chance[^0]   |
///  |                | Eclipse   | Left face is white; black face is black | 3 / 32 chance[^0]   |
///  |                | Void      | Left and right face are black           | 1 / 32 chance[^0]   |
///  |                | Curated   | One of 8 color themes (see below)       | 7 / 32 chance[^0]   |
///  | -------------- | --------- | --------------------------------------- | ------------------- |
///  | Color          | Nord      | 0x8FBCBBEBCB8BD087705E81ACB48EAD        | 1 / 8 chance[^0]    |
///  | Theme[^3]      | B/W       | 0x000000FFFFFFFFFFFFFFFFFF000000        | 1 / 8 chance[^0]    |
///  | (8 traits)     | Candycorn | 0x0D3B66F4D35EEE964BFAF0CAF95738        | 1 / 8 chance[^0]    |
///  |                | RGB       | 0xFFFF0000FF000000FFFF0000FFFF00        | 1 / 8 chance[^0]    |
///  |                | VSCode    | 0x1E1E1E569CD6D2D1A2BA7FB54DC4AC        | 1 / 8 chance[^0]    |
///  |                | Neon      | 0x00FFFFFFFF000000FF00FF00FF00FF        | 1 / 8 chance[^0]    |
///  |                | Jungle    | 0xBE3400015045020D22EABAACBE3400        | 1 / 8 chance[^0]    |
///  |                | Corn      | 0xF9C233705860211A28346830F9C233        | 1 / 8 chance[^0]    |
///  | -------------- | --------- | --------------------------------------- | ------------------- |
///  | Bit Border[^4] | True      | The bits have a 1px solid black border  | Any pieces captured |
///  | (2 traits)     | False     | The bits don't have any border          | No pieces captuered |
///  | ============== | ========= | ======================================= | =================== |
///  | [^0]: Determined from `_seed`.                                                             |
///  | [^1]: Gap is omitted when dimension is 1 x 1.                                              |
///  | [^2]: The first 5 color generation traits are algorithms. A base color is generated from   |
///  | `seed`, and the remaining colors are generated according to the selected algorithm. The    |
///  | color of the bits is always the complement of the randomly generated base color, and the   |
///  | background color depends on the algorithm:                                                 |
///  |     * Uniform: same as the base color;                                                     |
///  |     * Shades: darkest shade of the base color;                                             |
///  |     * Tints: lightest shade of the base color;                                             |
///  |     * Eclipse: same as the base color;                                                     |
///  |     * Void: complement of the base color.                                                  |
///  | If the selected color generation trait is "Curated," 1 of 8 pre-curated themes is randomly |
///  | selected.                                                                                  |
///  | [^3]: The entries in the 3rd column are bitpacked integers where                           |
///  |     * the first 24 bits represent the background color,                                    |
///  |     * the second 24 bits represent the left face's color,                                  |
///  |     * the third 24 bits represent the right face's color,                                  |
///  |     * the fourth 24 bits represent the top face's color,                                   |
///  |     * and the last 24 bits represent the bits' color.                                      |
///  | [^4]: Bit border is omitted when dimension is 12 x 12.                                     |
contract ThreeOutOfNineART is IThreeOutOfNineART, Ownable {
    using Strings for uint256;

    string internal constant SVG_STYLES =
        "--n:calc((394px - (var(--b) - 1)*var(--c))/var(--b));--o"
        ":calc(106px + var(--n));--p:calc(var(--a)/2)}section{height:var(--a);width:var(--a);backgr"
        "ound:var(--e);position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden}.c{height:0;"
        "width:0;position:absolute;transition:0.25s}.c:hover{transform:translate(0px,-64px);transit"
        "ion:0.25s}.c>*{height:var(--n);width:var(--n);border-bottom:4px solid black;border-right:4"
        "px solid black;border-left:1px solid black;border-top:1px solid black;transform-origin:0 0"
        ";position:relative;box-sizing:border-box}.c>*:nth-child(1){width:var(--d);background-color"
        ":var(--f);transform:rotate(90deg)skewX(-30deg)scaleY(0.864)}.c>*:nth-child(2){height:var(-"
        "-d);bottom:var(--n);background-color:var(--g);transform:rotate(-30deg)skewX(-30deg)scaleY("
        "0.864)}#h{background-color:var(--h)}#i{background-color:var(--i)}.c>*:nth-child(3){bottom:"
        "calc(var(--d) + var(--n));background-color:var(--h);display:grid;grid-template-columns:rep"
        "eat(";
    bytes32 internal constant HEXADECIMAL_DIGITS = "0123456789ABCDEF";
    bytes32 internal constant FILE_NAMES = "abcdef";

    string public image;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setImage(string memory _image) public onlyOwner {
        image = _image;
    }

    /// @notice Takes in data for a given fiveoutofnine NFT and outputs its metadata in JSON form.
    /// Refer to {fiveoutofnineART} for details.
    /// @dev The output is base 64-encoded.
    /// @param _internalId A bitpacked uint256 where the first 128 bits are the game ID, and the
    /// last 128 bits are the move ID within the game.
    /// @param _board Information about the board.
    /// @return Base 64-encoded JSON of metadata generated from `_internalId` and `_move`.
    function getMetadata(
        uint256 _internalId,
        uint256 _board
    ) external view returns (string memory) {
        string memory description;
        string memory animation;
        string memory attributes;

        {
            uint256 numSquares = 8;

            uint256 seed = uint256(keccak256(abi.encodePacked(_internalId)));

            (animation, attributes) = getAnimation(_board, numSquares, seed);
        }

        description = string(abi.encodePacked("---\\n\\n", drawMove(_board)));

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"Puzzle #',
                            Strings.toString(uint128(_internalId)),
                            '",'
                            '"description":"',
                            description,
                            '","animation_url":"data:text/html;base64,',
                            animation,
                            '","image":"',
                            abi.encodePacked(
                                "data:image/svg+xml;base64,",
                                Base64.encode(abi.encodePacked(image))
                            ),
                            '","attributes":[',
                            attributes,
                            "]}"
                        )
                    )
                )
            );
    }

    /// @notice Generates the HTML image and its attributes for a given board/seed according to the
    /// table described in {fiveoutofnineART}.
    /// @dev The output of the image is base 64-encoded.
    /// @param _board The board after the player's and engine's move are played.
    /// @param _numSquares The dimension of the board.
    /// @param _seed A hash of the game ID.
    /// @return Base 64-encoded image (in HTML) and its attributes.
    function getAnimation(
        uint256 _board,
        uint256 _numSquares,
        uint256 _seed
    ) internal pure returns (string memory, string memory) {
        string memory attributes = string(
            abi.encodePacked(
                '{"trait_type":"Dimension","value":"',
                _numSquares.toString(),
                unicode" × ",
                _numSquares.toString(),
                '"}'
            )
        );
        string memory styles = string(
            abi.encodePacked(
                "<style>:root{--a:1000px;--b:",
                _numSquares.toString(),
                ";--c:"
            )
        );

        {
            string memory gapAttribute;
            string memory gapValue = "0";
            if (_numSquares != 1) {
                if (_seed & 0xF < 4) (gapAttribute, gapValue) = ("None", "0");
                else if (_seed & 0xF < 13)
                    (gapAttribute, gapValue) = ("Narrow", "2");
                else if (_seed & 0xF < 15)
                    (gapAttribute, gapValue) = ("Wide", "12");
                else (gapAttribute, gapValue) = ("Ultrawide", "24");

                attributes = string(
                    abi.encodePacked(
                        attributes,
                        ',{"trait_type":"Gap","value":"',
                        gapAttribute,
                        '"}'
                    )
                );
            }
            styles = string(abi.encodePacked(styles, gapValue, "px;--d:"));
        }
        _seed >>= 4;

        {
            string memory heightAttribute;
            string memory heightValue;
            if (_seed & 0x3F < 1)
                (heightAttribute, heightValue) = ("Plane", "8");
            else if (_seed & 0x3F < 11)
                (heightAttribute, heightValue) = ("1/4", "98");
            else if (_seed & 0x3F < 21)
                (heightAttribute, heightValue) = ("1/2", "197");
            else if (_seed & 0x3F < 51)
                (heightAttribute, heightValue) = ("Cube", "394");
            else (heightAttribute, heightValue) = ("Infinite", "1000");

            attributes = string(
                abi.encodePacked(
                    attributes,
                    ',{"trait_type":"Height","value":"',
                    heightAttribute,
                    '"}'
                )
            );
            styles = string(abi.encodePacked(styles, heightValue, "px;"));
        }
        _seed >>= 6;

        {
            string memory tempAttribute;
            uint256 colorTheme;
            if (_seed & 0x1F < 25) {
                colorTheme = (_seed >> 5) & 0xFFFFFF;
                attributes = string(
                    abi.encodePacked(
                        attributes,
                        ',{"trait_type":"Base Color","value":',
                        colorTheme.toString(),
                        "}"
                    )
                );
                if (_seed & 0x1F < 7) {
                    tempAttribute = "Uniform";
                    colorTheme =
                        (colorTheme << 0x60) |
                        (colorTheme << 0x48) |
                        (colorTheme << 0x30) |
                        (colorTheme << 0x18) |
                        complementColor(colorTheme);
                } else if (_seed & 0x1F < 14) {
                    tempAttribute = "Shades";
                    colorTheme =
                        (darkenColor(colorTheme, 3) << 0x60) |
                        (darkenColor(colorTheme, 1) << 0x48) |
                        (darkenColor(colorTheme, 2) << 0x30) |
                        (colorTheme << 0x18) |
                        complementColor(colorTheme);
                } else if (_seed & 0x1F < 21) {
                    tempAttribute = "Tints";
                    colorTheme =
                        (brightenColor(colorTheme, 3) << 0x60) |
                        (brightenColor(colorTheme, 1) << 0x48) |
                        (brightenColor(colorTheme, 2) << 0x30) |
                        (colorTheme << 0x18) |
                        complementColor(colorTheme);
                } else if (_seed & 0x1F < 24) {
                    tempAttribute = "Eclipse";
                    colorTheme =
                        (colorTheme << 0x60) |
                        (0xFFFFFF << 0x48) |
                        (colorTheme << 0x18) |
                        complementColor(colorTheme);
                } else {
                    tempAttribute = "Void";
                    colorTheme =
                        (complementColor(colorTheme) << 0x60) |
                        (colorTheme << 0x18) |
                        complementColor(colorTheme);
                }
            } else {
                tempAttribute = "Curated";
                _seed >>= 5;

                attributes = string(
                    abi.encodePacked(
                        attributes,
                        ',{"trait_type":"Color Theme","value":"',
                        [
                            "Nord",
                            "B/W",
                            "Candycorn",
                            "RGB",
                            "VSCode",
                            "Neon",
                            "Jungle",
                            "Corn"
                        ][_seed & 7],
                        '"}'
                    )
                );

                colorTheme = [
                    0x8FBCBBEBCB8BD087705E81ACB48EAD000000FFFFFFFFFFFFFFFFFF000000,
                    0x0D3B66F4D35EEE964BFAF0CAF95738FFFF0000FF000000FFFF0000FFFF00,
                    0x1E1E1E569CD6D2D1A2BA7FB54DC4AC00FFFFFFFF000000FF00FF00FF00FF,
                    0xBE3400015045020D22EABAACBE3400F9C233705860211A28346830F9C233
                ][(_seed & 7) >> 1];
                colorTheme = _seed & 1 == 0
                    ? colorTheme >> 0x78
                    : colorTheme & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
            }
            attributes = string(
                abi.encodePacked(
                    attributes,
                    ',{"trait_type":"Color Generation","value":"',
                    tempAttribute,
                    '"}'
                )
            );
            styles = string(
                abi.encodePacked(
                    styles,
                    "--e:",
                    toColorHexString(colorTheme >> 0x60),
                    ";--f:",
                    toColorHexString((colorTheme >> 0x48) & 0xFFFFFF),
                    ";--g:",
                    toColorHexString((colorTheme >> 0x30) & 0xFFFFFF),
                    ";--h:",
                    toColorHexString((colorTheme >> 0x18) & 0xFFFFFF),
                    ";--i:",
                    toColorHexString(colorTheme & 0xFFFFFF),
                    ";"
                )
            );
        }

        {
            string memory tempAttribute;
            styles = string(
                abi.encodePacked(
                    styles,
                    SVG_STYLES,
                    Strings.toString(16 / _numSquares),
                    ",1fr);grid-template-rows:repeat(",
                    Strings.toString(16 / _numSquares),
                    ",1fr);transform:rotate(210deg)skew(-30deg)scaleY(0.864)}"
                )
            );
            if (_numSquares != 16) {
                tempAttribute = "False";
                attributes = string(
                    abi.encodePacked(
                        attributes,
                        ',{"trait_type":"Bit Border","value":"',
                        tempAttribute,
                        '"}'
                    )
                );
            }
        }

        unchecked {
            for (uint256 i; i < 31; ++i) {
                styles = string(
                    abi.encodePacked(
                        styles,
                        ".r",
                        i.toString(),
                        "{top:calc(var(--o) + ",
                        i.toString(),
                        "*(var(--n)/2 + var(--c)))}"
                        ".c",
                        i.toString(),
                        "{left:calc(var(--p) ",
                        i < 15 ? "-" : "+",
                        " 0.866*",
                        i < 15 ? (15 - i).toString() : (i - 15).toString(),
                        "*(var(--n) + var(--c)))}"
                    )
                );
            }

            // iterates diagonally starting from the back
            string memory animation;
            for (uint256 row; row < (_numSquares << 1) - 1; ++row) {
                uint256 tempCol = row <= _numSquares - 1
                    ? 15 - row
                    : 15 - ((_numSquares << 1) - 2 - row);
                for (
                    uint256 col = tempCol;
                    col <=
                    (
                        row <= _numSquares - 1
                            ? tempCol + (row << 1)
                            : tempCol + (((_numSquares << 1) - 2 - row) << 1)
                    );
                    col = col + 2
                ) {
                    animation = string(
                        abi.encodePacked(
                            animation,
                            getPillarHtml(_board, 16 / _numSquares, row, col)
                        )
                    );
                }
            }

            string memory script;
            script = string(
                abi.encodePacked(
                    '<script type="text/javascript">',
                    "w=window;w.addEventListener('DOMContentLoaded',()=>{n=document.querySelector('section').style;",
                    "n.transformOrigin='top left';a=()=>n.transform='scale('+w.innerWidth/1000+')';a();w.onresize=a});",
                    "</script>"
                )
            );

            return (
                Base64.encode(
                    abi.encodePacked(
                        script,
                        styles,
                        "</style><section>",
                        animation,
                        "</section>"
                    )
                ),
                attributes
            );
        }
    }

    /// @notice Returns the HTML for a particular pillar within the image.
    /// @param _board The board after the player's and engine's move are played.
    /// @param _dim The dimension of the bits within a pillar.
    /// @param _row The row index of the pillar.
    /// @param _col The column index of the pillar.
    /// @return The HTML for the pillar described by the parameters.
    function getPillarHtml(
        uint256 _board,
        uint256 _dim,
        uint256 _row,
        uint256 _col
    ) internal pure returns (string memory) {
        string memory pillar = string(
            abi.encodePacked(
                '<div class="c r',
                _row.toString(),
                " c",
                _col.toString(),
                '"><div></div><div></div><div>'
            )
        );

        uint256 x;
        uint256 y;
        uint256 colOffset;
        uint256 rowOffset;
        unchecked {
            for (
                uint256 subRow = _row * _dim + ((_dim - 1) << 1);
                subRow >= _row * _dim + (_dim - 1);
                --subRow
            ) {
                rowOffset = 0;
                uint256 tempSubCol = _col <= 15
                    ? 15 - _dim * (15 - _col) + colOffset
                    : 15 + _dim * (_col - 15) + colOffset;
                for (
                    uint256 subCol = tempSubCol;
                    subCol >= tempSubCol + 1 - _dim;
                    --subCol
                ) {
                    x = 15 - ((15 + subCol - (subRow - rowOffset)) >> 1);
                    y = 22 - ((subCol + subRow - rowOffset) >> 1);

                    // (board >> (transformedPosition * 4)) >> [1,3,0,2]
                    pillar = string(
                        abi.encodePacked(
                            pillar,
                            '<div id="',
                            ((_board >> ((8 * (y >> 1) + (x >> 1)) << 2)) >>
                                (((0xD8 >> ((x & 1) << 2)) >> ((y & 1) << 1)) &
                                    3)) &
                                1 ==
                                0
                                ? "h"
                                : "i",
                            '"></div>'
                        )
                    );
                    rowOffset++;
                    if (subCol == 0) break;
                }
                colOffset++;
                if (subRow == 0) break;
            }
        }

        return string(abi.encodePacked(pillar, "</div></div>"));
    }

    /// @notice Computes the complement of 24-bit colors.
    /// @param _color A 24-bit color.
    /// @return The complement of `_color`.
    function complementColor(uint256 _color) internal pure returns (uint256) {
        unchecked {
            return 0xFFFFFF - _color;
        }
    }

    /// @notice Darkens 24-bit colors.
    /// @param _color A 24-bit color.
    /// @param _num The number of shades to darken by.
    /// @return `_color` darkened `_num` times.
    function darkenColor(
        uint256 _color,
        uint256 _num
    ) internal pure returns (uint256) {
        return
            (((_color >> 0x10) >> _num) << 0x10) |
            ((((_color >> 8) & 0xFF) >> _num) << 8) |
            ((_color & 0xFF) >> _num);
    }

    /// @notice Brightens 24-bit colors.
    /// @param _color A 24-bit color.
    /// @param _num The number of tints to brighten by.
    /// @return `_color` brightened `_num` times.
    function brightenColor(
        uint256 _color,
        uint256 _num
    ) internal pure returns (uint256) {
        unchecked {
            return
                ((0xFF - ((0xFF - (_color >> 0x10)) >> _num)) << 0x10) |
                ((0xFF - ((0xFF - ((_color >> 8) & 0xFF)) >> _num)) << 8) |
                (0xFF - ((0xFF - (_color & 0xFF)) >> _num));
        }
    }

    /// @notice Returns the color hex string of a 24-bit color.
    /// @param _integer A 24-bit color.
    /// @return The color hex string of `_integer`.
    function toColorHexString(
        uint256 _integer
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "#",
                    HEXADECIMAL_DIGITS[(_integer >> 0x14) & 0xF],
                    HEXADECIMAL_DIGITS[(_integer >> 0x10) & 0xF],
                    HEXADECIMAL_DIGITS[(_integer >> 0xC) & 0xF],
                    HEXADECIMAL_DIGITS[(_integer >> 8) & 0xF],
                    HEXADECIMAL_DIGITS[(_integer >> 4) & 0xF],
                    HEXADECIMAL_DIGITS[_integer & 0xF]
                )
            );
    }

    /// @notice Draws out a move being played out on a board position as a string with unicode
    /// characters to represent pieces. Files and rows are labeled with standard algebraic
    /// notation. For example:
    /// ```
    /// 6 ♜ ♝ ♛ ♚ ♝ ♜
    /// 5 ♟ ♟ ♟ ♟ ♟ ♟
    /// 4 · · · · · ·
    /// 3 · · ♙ · · ·
    /// 2 ♙ ♙ * ♙ ♙ ♙
    /// 1 ♖ ♘ ♕ ♔ ♘ ♖
    ///  a b c d e f
    /// ```
    /// * indicates the square the piece moved from.
    /// @param _board The board the move is played on.
    /// @return The string showing the move played out on the board.
    function drawMove(uint256 _board) internal pure returns (string memory) {
        string memory boardString = "```\\n";

        for (uint256 index = 63; index != 0; index--) {
            uint256 indexToDraw = index;
            boardString = string(
                abi.encodePacked(
                    boardString,
                    indexToDraw & 7 == 7
                        ? string(
                            abi.encodePacked(
                                Strings.toString((indexToDraw >> 3) + 1),
                                " "
                            )
                        )
                        : "",
                    getPieceChar((_board >> (indexToDraw << 2)) & 0xF),
                    indexToDraw & 7 == 0 && indexToDraw != 0
                        ? "\\n"
                        : indexToDraw != 0
                        ? " "
                        : ""
                )
            );
        }

        boardString = string(
            abi.encodePacked(
                boardString,
                getPieceChar(_board & 0xF),
                "\\n  a b c d e f g h\\n```"
            )
        );

        return boardString;
    }

    /// @notice Maps pieces to its corresponding unicode character.
    /// @param _piece A piece.
    /// @return The unicode character corresponding to `_piece`. It returns ``.'' otherwise.
    function getPieceChar(
        uint256 _piece
    ) internal pure returns (string memory) {
        if (_piece == 1) return unicode"♟";
        if (_piece == 2) return unicode"♝";
        if (_piece == 3) return unicode"♜";
        if (_piece == 4) return unicode"♞";
        if (_piece == 5) return unicode"♛";
        if (_piece == 6) return unicode"♚";
        if (_piece == 9) return unicode"♙";
        if (_piece == 0xA) return unicode"♗";
        if (_piece == 0xB) return unicode"♖";
        if (_piece == 0xC) return unicode"♘";
        if (_piece == 0xD) return unicode"♕";
        if (_piece == 0xE) return unicode"♔";
        return unicode"·";
    }
}
