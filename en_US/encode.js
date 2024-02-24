/// MAIN
function encode(selectedSetId, loadout) {
    return encodev1(selectedSetId, loadout);
}

function decode(code) {
    if (code[0] == 0) {
        return decodev0(code);
    } else if (code[0] == 1) {
        return decodev1(code);
    } else {
        console.log("invalid code")
        return false;
    }
}

/// -------------------------------------------------------
/// UTIL
function bin(val, bits) {
    var bin = val.toString(2);
    bin = "0".repeat(bits).substr(bin.length) + bin;
    return bin;
}

function hex(val, digits) {
    val &= (1 << (digits * 4)) - 1;
    var hex = val.toString(16).toLowerCase();
    return "0".repeat(digits).substr(hex.length) + hex;
}

function dec(val, digits) {
    var dec = val.toString(10);
    dec = "0".repeat(digits).substr(dec.length) + dec;
    return dec;
}


function binaryToHex(s) {
    var i, k, part, accum, ret = '';
    for (i = s.length - 1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i + 1 - 4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
                return {
                    valid: false
                };
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'a'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return {
                    valid: false
                };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
    }
    return {
        valid: true,
        result: ret
    };
}

// converts hexadecimal string to a binary string
// returns an object with key 'valid' to a boolean value, indicating
// if the string is a valid hexadecimal string.
// If 'valid' is true, the converted binary string can be obtained by
// the 'result' key of the returned object
function hexToBinary(s) {
    var i, k, part, ret = '';
    // lookup table for easier conversion. '0' characters are padded for '1' to '7'
    var lookupTable = {
        '0': '0000',
        '1': '0001',
        '2': '0010',
        '3': '0011',
        '4': '0100',
        '5': '0101',
        '6': '0110',
        '7': '0111',
        '8': '1000',
        '9': '1001',
        'a': '1010',
        'b': '1011',
        'c': '1100',
        'd': '1101',
        'e': '1110',
        'f': '1111',
        'A': '1010',
        'B': '1011',
        'C': '1100',
        'D': '1101',
        'E': '1110',
        'F': '1111'
    };
    for (i = 0; i < s.length; i += 1) {
        if (lookupTable.hasOwnProperty(s[i])) {
            ret += lookupTable[s[i]];
        } else {
            return {
                valid: false
            };
        }
    }
    return {
        valid: true,
        result: ret
    };
}

/// -------------------------------------------------------

/// VERSION 0
function encodev0(selectedSetId, loadout) {
    var hexString = '0' // version number
    hexString += hex(selectedSetId, 1)
    hexString += hex(loadout.weapon.id, 2);
    hexString += encodeGearv0(loadout.head);
    hexString += encodeGearv0(loadout.clothes);
    hexString += encodeGearv0(loadout.shoes);
    hexString += encodeSplashtagv0(loadout.splashtag);
    return hexString;
};

function encodeSplashtagv0(item) {
    var string = "";
    var title = "";
    title += bin(item.adjective.id, 10)
    title += bin(item.subject.id, 10)
    string += binaryToHex(title).result

    var bgbadge = "";
    bgbadge += bin(item.bg.id, 9)
    for (var i = 0; i < item.badges.length; i++) {
        if (item.badges[i] == null) {
            bgbadge += bin(0, 9)
        } else {
            bgbadge += bin(item.badges[i].id, 9)
        }
    }
    string += binaryToHex(bgbadge).result
    string += dec(item.discriminator, 4)
    string += encodeURIComponent(item.name)
    return string
}

function decodeSplashtagv0(code) {
    var splashtag = {
        adjective: null,
        subject: null,
        bg: null,
        badges: [null, null, null],
        name: "",
        discriminator: 0
    }
    var title = hexToBinary(code.substring(0, 5)).result
    splashtag.adjective = parseInt(title.substring(0, 10), 2)
    splashtag.subject = parseInt(title.substring(10, 20), 2)

    var bgbadge = hexToBinary(code.substring(5, 14)).result
    splashtag.bg = parseInt(bgbadge.substring(0, 9), 2)
    for (var i = 0; i < 3; i++) {
        splashtag.badges[i] = parseInt(bgbadge.substring(9 + i * 9, 18 + i * 9), 2)
    }
    splashtag.discriminator = parseInt(code.substring(14, 18), 10)
    splashtag.name = decodeURIComponent(code.substring(18))
    console.log("Decoded Splastag (v0):")
    console.log(splashtag)
    return splashtag
}

function encodeGearv0(item) {
    var string = hex(item.equipped.id, 2);
    var abilities = "";
    if (item.main == null) {
        abilities += bin(0, 5)
    } else {
        abilities += bin(item.main.id, 5)
    }
    for (var i = 0; i < item.subs.length; i++) {
        if (item.subs[i] == null) {
            abilities += bin(0, 5)
        } else {
            abilities += bin(item.subs[i].id, 5)
        }
    }
    string += binaryToHex(abilities).result
    return string
}

function decodeGearv0(code) {
    var gearid = parseInt(code.substring(0, 2), 16)
    var rawAbilities = code.substring(2, 8)
    var binAbilities = hexToBinary(rawAbilities).result
    var main = parseInt(binAbilities.substring(0, 5), 2)
    var subs = []
    for (var i = 5; i < binAbilities.length; i += 5) {
        subs.push(parseInt(binAbilities.substring(i, i + 5), 2))
    }
    return { gear: gearid, main: main, subs: subs }
}

function decodev0(code) {
    if (code[0] != 0) {
        console.log("invalid code")
        return false;
    }
    try {
        var weaponset = parseInt(code[1], 16)
        var weaponid = parseInt(code.substring(2, 4), 16)
        var head = decodeGearv0(code.substring(4, 11))
        var clothes = decodeGearv0(code.substring(11, 18))
        var shoes = decodeGearv0(code.substring(18, 25))
        var splashtag = decodeSplashtagv0(code.substring(25))
    } catch (err) {
        console.log("Invalid code: " + err.message)
        return false;
    }
    return { set: weaponset, weapon: weaponid, head: head, clothes: clothes, shoes: shoes, splashtag: splashtag };
}


/// -------------------------------------------------------

/// VERSION 1
function encodev1(selectedSetId, loadout) {
    var hexString = '1' // version number
    hexString += hex(selectedSetId, 1)
    hexString += hex(loadout.weapon.id, 2);
    hexString += encodeGearv1(loadout.head);
    hexString += encodeGearv1(loadout.clothes);
    hexString += encodeGearv1(loadout.shoes);
    hexString += encodeSplashtagv1(loadout.splashtag);
    return hexString;
};

function encodeSplashtagv1(item) {
    var string = "";
    var title = "";
    title += bin(item.adjective.id, 12)
    title += bin(item.subject.id, 12)
    string += binaryToHex(title).result

    var bgbadge = "";
    bgbadge += bin(item.bg.id, 10)
    for (var i = 0; i < item.badges.length; i++) {
        if (item.badges[i] == null) {
            bgbadge += bin(0, 10)
        } else {
            bgbadge += bin(item.badges[i].id, 10)
        }
    }
    string += binaryToHex(bgbadge).result
    string += dec(item.discriminator, 4)
    string += encodeURIComponent(item.name)
    return string
}

function decodeSplashtagv1(code) {
    var splashtag = {
        adjective: null,
        subject: null,
        bg: null,
        badges: [null, null, null],
        name: "",
        discriminator: 0
    }
    var title = hexToBinary(code.substring(0, 6)).result
    splashtag.adjective = parseInt(title.substring(0, 12), 2)
    splashtag.subject = parseInt(title.substring(12, 24), 2)

    var bgbadge = hexToBinary(code.substring(6, 16)).result
    splashtag.bg = parseInt(bgbadge.substring(0, 10), 2)
    for (var i = 0; i < 3; i++) {
        splashtag.badges[i] = parseInt(bgbadge.substring(10 + i * 10, 20 + i * 10), 2)
    }
    splashtag.discriminator = parseInt(code.substring(16, 20), 10)
    splashtag.name = decodeURIComponent(code.substring(20))
    console.log("Decoded Splastag (v1):")
    console.log(splashtag)
    return splashtag
}

function encodeGearv1(item) {
    var string = hex(item.equipped.id, 3);
    var abilities = "";
    if (item.main == null) {
        abilities += bin(0, 5)
    } else {
        abilities += bin(item.main.id, 5)
    }
    for (var i = 0; i < item.subs.length; i++) {
        if (item.subs[i] == null) {
            abilities += bin(0, 5)
        } else {
            abilities += bin(item.subs[i].id, 5)
        }
    }
    string += binaryToHex(abilities).result
    return string
}

function decodeGearv1(code) {
    var gearid = parseInt(code.substring(0, 3), 16)
    var rawAbilities = code.substring(3, 9)
    var binAbilities = hexToBinary(rawAbilities).result
    var main = parseInt(binAbilities.substring(0, 5), 2)
    var subs = []
    for (var i = 5; i < binAbilities.length; i += 5) {
        subs.push(parseInt(binAbilities.substring(i, i + 5), 2))
    }
    return { gear: gearid, main: main, subs: subs }
}

function decodev1(code) {
    if (code[0] != 1) {
        console.log("invalid code")
        return false;
    }
    try {
        var weaponset = parseInt(code[1], 16)
        var weaponid = parseInt(code.substring(2, 4), 16)
        var head = decodeGearv1(code.substring(4, 12))
        var clothes = decodeGearv1(code.substring(12, 20))
        var shoes = decodeGearv1(code.substring(20, 28))
        var splashtag = decodeSplashtagv1(code.substring(28))
    } catch (err) {
        console.log("Invalid code: " + err.message)
        return false;
    }
    return { set: weaponset, weapon: weaponid, head: head, clothes: clothes, shoes: shoes, splashtag: splashtag };
}