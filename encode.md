<!-- markdownlint-disable-file MD024 -->

# How does encoding work?

## Splatoon 3 edition

(This is more for my own reference than anything else.)

- `X` is a placeholder for a hexadecimal digit (0-9, A-F)
- `D` is a placeholder for a digit (0-9)
- `0` is a placeholder for a binary digit (0-1) (except version number)

## Version 0 (pre-Fresh Season 2024)

```txt
0 X XX XXXXXXX XXXXXXX XXXXXXX XXXXXXXXXXXXXXDDDD PlayerName
^ ^ ^  ^       ^       ^       ^                  ^
1 2 3  4       5       6       7                  8
```

## Version 1 (Fresh Season 2024 - Sizzle Season 2025)

```txt
1 X XX XXXXXXXX XXXXXXXX XXXXXXXX XXXXXXXXXXXXXXXXDDDD PlayerName
^ ^ ^  ^        ^        ^        ^                    ^
1 2 3  4        5        6        7                    8
```

## Version 2 (Sizzle Season 2025 - current)

```txt
2 X XX XXXXXXXX XXXXXXXX XXXXXXXX XXXXXXXXXXXXXXXXXDDDD PlayerName
^ ^ ^  ^        ^        ^        ^                     ^
1 2 3  4        5        6        7                     8
```

## Key

1. Version number
2. Weapon Set
3. Weapon ID
4. [Encoded Hat](#gear-encoding)
5. [Encoded Clothes](#gear-encoding)
6. [Encoded Shoes](#gear-encoding)
7. [Encoded Splashtag](#splashtag-encoding)
8. Player's name

## Gear Encoding

### Version 0

```txt
XX XXXXX
^  ^
1  2
```

### Version 1 & Version 2

```txt
XXX XXXXX
^   ^
1   2
```

1. Gear ID (0-255 v0, 0-1023 v1)
2. [Encoded Ability](#ability-encoding)

## Ability Encoding

```txt
XXXXX - Hex to Binary
00000 00000 00000 00000
^     ^     ^     ^
1     2     3     4
```

4 groups of 5 bits, converted to a 5-digit hexadecimal number.

1. Main ability
2. Sub ability 1
3. Sub ability 2
4. Sub ability 3

## Splashtag Encoding

### Version 0

```txt
XXXXX XXXXXXXXX DDDD
^     ^         ^
1     2         3
```

### Version 1

```txt
XXXXXX XXXXXXXXXX DDDD
^      ^          ^
1      2          3
```

### Version 2

```txt
XXXXXX XXXXXXXXXXX DDDD
^      ^           ^
1      2           3
```

1. [Encoded Title](#title-encoding)
2. [Encoded Background And Badges](#background-and-badges-encoding)
3. Discriminator

## Title Encoding

### Version 0

```txt
XXXXX - Hex to Binary
0000000000 0000000000
^          ^
1          2
```

### Version 1 & 2

```txt

XXXXXX - Hex to Binary
000000000000 000000000000
^            ^
1            2
```

1. Adjective
2. Subject

Version 0 - 2 groups of 10 bits, converted to a 5-digit hexadecimal number.

Version 1 & 2 - 2 groups of 12 bits, converted to a 6-digit hexadecimal number.

## Background and Badges Encoding

### Version 0

```txt
XXXXXXXXX - Hex to Binary
000000000 000000000 000000000 000000000
^         ^         ^         ^
1         2         3         4
```

### Version 1

```txt
XXXXXXXXXX - Hex to Binary
0000000000 0000000000 0000000000 0000000000
^          ^          ^          ^
1          2          3          4
```

### Version 2

```txt
XXXXXXXXXXX - Hex to Binary
00000000000 00000000000 00000000000 00000000000
^           ^           ^           ^
1           2           3           4
```

1. Background
2. Badge 1
3. Badge 2
4. Badge 3

Version 0 - 4 groups of 9 bits, converted to a 9-digit hexadecimal number.

Version 1 - 4 groups of 10 bits, converted to a 10-digit hexadecimal number.

Version 2 - 4 groups of 11 bits, converted to an 11-digit hexadecimal number.

## Max Values

- Weapon Set: 16
- Weapon: 256
- Gear: 256 (v0), 1024 (v1/v2)
- Ability: 32
- Adjective: 1024 (v0), 4096 (v1/v2)
- Subject: 1024 (v0), 4096 (v1/v2)
- Background: 512 (v0), 1024 (v1), 2048 (v2)
- Badge: 512 (v0), 1024 (v1), 2048 (v2)
- Discriminator: 9999