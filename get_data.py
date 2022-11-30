import asyncio
from pathlib import Path
import aiohttp
from tqdm import tqdm
import json
import re

VERSIONS = [
    "110",
    "200",
]

hats = "https://leanny.github.io/splat3/data/mush/{VERSION}/GearInfoHead.json"
shirts = "https://leanny.github.io/splat3/data/mush/{VERSION}/GearInfoClothes.json"
shoes = "https://leanny.github.io/splat3/data/mush/{VERSION}/GearInfoShoes.json"
weapons = "https://leanny.github.io/splat3/data/mush/{VERSION}/WeaponInfoMain.json"
subs = "https://leanny.github.io/splat3/data/mush/{VERSION}/WeaponInfoSub.json"
specials = "https://leanny.github.io/splat3/data/mush/{VERSION}/WeaponInfoSpecial.json"
brands = "https://leanny.github.io/splat3/data/parameter/{VERSION}/misc/spl__BrandTraitsParam.spl__BrandTraitsParam.json"
skills = (
    "https://leanny.github.io/splat3/data/parameter/{VERSION}/misc/spl__GearSkillTraitsParam.spl__GearSkillTraitsParam.json"
)

splashtags = "https://leanny.github.io/splat3/data/mush/{VERSION}/NamePlateBgInfo.json"
adjectives = "https://leanny.github.io/splat3/data/mush/{VERSION}/BynameAdjectiveInfo.json"
subjects = "https://leanny.github.io/splat3/data/mush/{VERSION}/BynameSubjectInfo.json"
badges = "https://leanny.github.io/splat3/data/mush/{VERSION}/BadgeInfo.json"


locale = {
    "en_GB": "https://leanny.github.io/splat3/data/language/EUen.json",
    "en_US": "https://leanny.github.io/splat3/data/language/USen.json",
    "es_ES": "https://leanny.github.io/splat3/data/language/EUes.json",
    "es_MX": "https://leanny.github.io/splat3/data/language/USes.json",
    "fr_FR": "https://leanny.github.io/splat3/data/language/EUfr.json",
    "fr_CA": "https://leanny.github.io/splat3/data/language/USfr.json",
    "de_DE": "https://leanny.github.io/splat3/data/language/EUde.json",
    "nl_NL": "https://leanny.github.io/splat3/data/language/EUnl.json",
    "ru_RU": "https://leanny.github.io/splat3/data/language/EUru.json",
    "it_IT": "https://leanny.github.io/splat3/data/language/EUit.json",
    "ja_JP": "https://leanny.github.io/splat3/data/language/JPja.json",
}

adjective_info = {
    "en_GB": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_EUen.json",
    "en_US": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_USen.json",
    "es_ES": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_EUes.json",
    "es_MX": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_USes.json",
    "fr_FR": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_EUfr.json",
    "fr_CA": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_USfr.json",
    "de_DE": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_EUde.json",
    "nl_NL": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_EUnl.json",
    "ru_RU": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_EUru.json",
    "it_IT": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_EUit.json",
    "ja_JP": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Adjective_JPja.json",
}

subject_info = {
    "en_GB": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_EUen.json",
    "en_US": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_USen.json",
    "es_ES": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_EUes.json",
    "es_MX": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_USes.json",
    "fr_FR": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_EUfr.json",
    "fr_CA": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_USfr.json",
    "de_DE": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_EUde.json",
    "nl_NL": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_EUnl.json",
    "ru_RU": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_EUru.json",
    "it_IT": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_EUit.json",
    "ja_JP": "https://leanny.github.io/splat3/data/parameter/{VERSION}/byname/Subject_JPja.json",
}

PATHS = [
    "en_US/data/json",
    "ja_JP/data/json",
]


async def jayson(url: str, vs = [], byname = False) -> dict:
    try:
        if vs:
            print(vs)
            data = []
            for v in vs:
                print(url)
                new_url = url.format(VERSION=v)
                print(new_url)
                async with aiohttp.ClientSession() as session:
                    async with session.get(new_url) as resp:
                        data.append(await resp.json())
            return data

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                return await resp.json()
    except aiohttp.ContentTypeError:
        if byname:
            return {}
        else:
            raise


async def save(path: str, data):
    for PATH in PATHS:
        with open(PATH + path, "w") as f:
            json.dump(data, f, indent=4)


async def gear(type, type2, listies, locale_data):
    alll = []
    eyedees = []
    i = 0
    for listie in listies:
        for gear_piece in listie:
            eyedee = gear_piece["__RowId"]
            internal_id = gear_piece["Id"]
            if not (gear_piece["Id"] > 0 and gear_piece["HowToGet"] != "Impossible" and "_MSN" not in eyedee):
                continue
            if internal_id in eyedees: continue

            image = f"../common/assets/img/gear/{type.lower()}/{eyedee}.png"
            localizedName = {}
            try:
                for locale, ldata in locale_data.items():
                    localizedName[locale] = ldata[f"CommonMsg/Gear/GearName_{type2}"][eyedee.split("_")[1]]
            except KeyError:
                print(eyedee)
                continue
            name = localizedName["en_US"]
            main = locale_data["en_US"]["CommonMsg/Gear/GearPowerName"][gear_piece["Skill"]]
            stars = gear_piece["Rarity"]
            brand = locale_data["en_US"]["CommonMsg/Gear/GearBrandName"][gear_piece["Brand"]]
            id = i
            alll.append(
                {
                    "id": id,
                    "internal-id": internal_id,
                    "name": name,
                    "image": image,
                    "main": main,
                    "stars": stars,
                    "localizedName": localizedName,
                    "brand": brand,
                    "internal": eyedee,
                }
            )
            eyedees.append(internal_id)
            i += 1
    return alll


async def sub(listies, locale_data):
    alll = []
    eyedees = []
    for listie in listies:
        for sub in listie:
            eyedee = sub["__RowId"]
            if eyedee in eyedees: continue
            image = f"../common/assets/img/subspe/Wsb_{eyedee}.png"
            localizedName = {}
            try:
                for locale, ldata in locale_data.items():
                    localizedName[locale] = ldata["CommonMsg/Weapon/WeaponName_Sub"][eyedee]
            except KeyError:
                print(eyedee)
                continue
            name = localizedName["en_US"]
            alll.append(
                {
                    "name": name,
                    "image": image,
                    "localizedName": localizedName,
                    "internal": f"Wsb_{eyedee}",
                }
            )
            eyedees.append(eyedee)
    return alll


async def special(listies, locale_data):
    alll = []
    eyedees = []
    for listie in listies:
        for special in listie:
            eyedee = special["__RowId"]
            if "Mission" in eyedee: continue
            if "Coop" in eyedee: continue
            if eyedee in eyedees: continue
            image = f"../common/assets/img/subspe/Wsp_{eyedee}.png"
            localizedName = {}
            try:
                for locale, ldata in locale_data.items():
                    localizedName[locale] = ldata["CommonMsg/Weapon/WeaponName_Special"][eyedee]
            except KeyError:
                print(eyedee)
                continue
            name = localizedName["en_US"]
            alll.append(
                {
                    "name": name,
                    "image": image,
                    "localizedName": localizedName,
                    "internal": f"Wsp_{eyedee}",
                }
            )
            eyedees.append(eyedee)
    return alll


async def weapon(listies, locale_data):
    weaponsets = []
    eyedees = []
    sets = set(map(lambda x: x["__RowId"].split("_")[0], listies[-1]))
    sets.remove("Free")
    sets = list(sets)
    sets.sort()
    for j, weaponset in enumerate(sets):
        id = j
        localizedNamee = {}
        for locale, ldata in locale_data.items():
            localizedNamee[locale] = ldata["CommonMsg/Weapon/WeaponTypeName"][weaponset]
        type_ = localizedNamee["en_US"]
        weapons = []
        i = 0
        print(len(listies))
        for listie in listies:
            for weapon in listie:
                if "Shooter_Normal_01" in str(weapon):
                    print("found")
                    # print([listie == l for l in listies])
                    # print(weaponset)
                    # print(weapon["__RowId"].split("_")[0])
                    # print(weapon["Id"])
                if weapon["__RowId"].split("_")[0] == weaponset:
                    if weapon["Id"] >= 10_000:
                        continue
                    eyedee = weapon["__RowId"]
                    if eyedee in eyedees: continue
                    image = f"../common/assets/img/weapons/{eyedee}.png"
                    localizedName = {}
                    try:
                        for locale, ldata in locale_data.items():
                            localizedName[locale] = ldata["CommonMsg/Weapon/WeaponName_Main"][eyedee]
                    except KeyError:
                        print(eyedee)
                        continue
                    name = localizedName["en_US"]
                    id_ = i
                    class_ = weaponset
                    try:
                        sub_ = locale_data["en_US"]["CommonMsg/Weapon/WeaponName_Sub"][
                            weapon["SubWeapon"].split(".")[0][10:]
                        ]
                        special_ = locale_data["en_US"]["CommonMsg/Weapon/WeaponName_Special"][
                            weapon["SpecialWeapon"].split(".")[0][10:]
                        ]
                    except:
                        print(repr(eyedee), repr(name), repr(weapon["SubWeapon"]))
                        raise
                    weapons.append(
                        {
                            "id": id_,
                            "name": name,
                            "image": image,
                            "class": class_,
                            "sub": sub_,
                            "special": special_,
                            "localizedName": localizedName,
                            "internal": eyedee,
                        }
                    )

                    eyedees.append(eyedee)
                    i += 1
        weaponsets.append({"id": id, "type": type_, "weapons": weapons, "localizedName": localizedNamee})
    print(eyedees)
    return weaponsets


async def skill(listie, locale_data):
    alll = []
    listie = listie[0] # Change if skills change
    listie = listie["Traits"]
    listie = [{"__RowId": k, **v} for k, v in listie.items() if k != "None"]
    for i, sk in enumerate(listie, start=1):
        eyedee = sk["__RowId"]
        image = f"../common/assets/img/skills/{eyedee}.png"
        localizedName = {}
        try:
            for locale, ldata in locale_data.items():
                localizedName[locale] = ldata["CommonMsg/Gear/GearPowerName"][eyedee]
        except KeyError:
            print(eyedee)
            continue
        name = localizedName["en_US"]
        alll.append({"id": i, "name": name, "image": image, "localizedName": localizedName, "internal": eyedee})
        if sk["KindLimit"] != "None":
            alll[-1]["exclusive"] = (
                f"loadout.{sk['KindLimit'].lower()}.main" if name != "Ability Doubler" else "hidden"
            )
    return alll


async def brand(listie, locale_data):
    alll = {}
    listie = listie[0] # Change if brands change
    listie = listie["Traits"]
    listie = [{"__RowId": k, **v} for k, v in listie.items()]
    for br in listie:
        eyedee = br["__RowId"]
        image = f"../common/assets/img/brands/{eyedee}.png"
        localizedName = {}
        try:
            for locale, ldata in locale_data.items():
                localizedName[locale] = ldata["CommonMsg/Gear/GearBrandName"][eyedee]
        except KeyError:
            print(eyedee)
            continue
        name = localizedName["en_US"]
        frequent = locale_data["en_US"]["CommonMsg/Gear/GearPowerName"][br["UsualGearSkill"]]
        infrequent = locale_data["en_US"]["CommonMsg/Gear/GearPowerName"][br["UnusualGearSkill"]]
        alll[name] = {
            "name": name,
            "image": image,
            "common": frequent,
            "uncommon": infrequent,
            "localizedName": localizedName,
            "internal": eyedee,
        }
    return alll


async def splashtag(listies, locale_data):
    alll = []
    eyedees = []
    i = 0
    for listie in listies:
        for tag in listie:
            eyedee = tag["__RowId"]
            if eyedee in eyedees: continue
            image = f"../common/assets/img/splashtags/{eyedee}.png"
            r = tag["TextColor"]["R"]
            g = tag["TextColor"]["G"]
            b = tag["TextColor"]["B"]
            alll.append({"id": i, "image": image, "color": {"r": r, "g": g, "b": b}, "internal": eyedee})
            eyedees.append(eyedee)
            i += 1
    return alll


async def adjective(listies, locale_data, info_datas):
    alll = []
    eyedees = []
    i = 0
    for listie, info_data in zip(listies, info_datas):
        for adj in listie:
            eyedee = adj["Id"]
            if eyedee in eyedees: continue
            localizedName = {}
            available = {}
            try:
                for locale, ldata in locale_data.items():
                    localizedName[locale] = ldata["CommonMsg/Byname/BynameAdjective"].get(f"{eyedee:04}", str(eyedee))
                    localizedName[locale] = re.sub(r"\[.*\]", "", localizedName[locale])
                    available[locale] = f"{eyedee:04}" in info_data[locale]["Labels"] if info_data[locale] else "Unknown"
            except KeyError:
                print(eyedee)
                for locale, ldata in locale_data.items():
                    try:
                        ldata["CommonMsg/Byname/BynameAdjective"].get(f"{eyedee:04}", str(eyedee))
                    except:
                        print(eyedee, locale)
                continue
            name = localizedName["en_US"]

            alll.append(
                {"name": name, "localizedName": localizedName, "available": available, "id": i, "internal": f"{eyedee:04}"}
            )
            eyedees.append(eyedee)
            i += 1
    return alll


async def subject(listies, locale_data, info_datas):
    alll = []
    eyedees = []
    i = 0
    for listie, info_data in zip(listies, info_datas):
        for subj in listie:
            eyedee = subj["Id"]
            if eyedee in eyedees: continue
            localizedName = {}
            available = {}
            try:
                for locale, ldata in locale_data.items():
                    localizedName[locale] = ldata["CommonMsg/Byname/BynameSubject"].get(f"{eyedee:04}_0", str(eyedee))
                    localizedName[locale] = re.sub(r"\[.*\]", "", localizedName[locale])
                    available[locale] = f"{eyedee:04}" in info_data[locale]["Labels"]
            except KeyError:
                print(eyedee)
                continue
            name = localizedName["en_US"]

            alll.append(
                {"name": name, "localizedName": localizedName, "available": available, "id": i, "internal": f"{eyedee:04}"}
            )
            eyedees.append(eyedee)
            i += 1
    return alll


async def badge(listies, locale_data, weapons_datas, special_datas):
    alll = []
    alll.append(
        {
            "name": "None",
            "image": f"../common/assets/img/badges/None.png",
            "localizedName": {l: "None" for l in locale_data.keys()},
            "id": 0,
            "internal": "None",
        }
    )
    eyedeess = []
    i = 1
    for listie, weapons_data, special_data in zip(listies, weapons_datas, special_datas):
        for badge in listie:
            eyedee: str = badge["__RowId"]
            eyedee = eyedee.replace("Work/Gyml/BadgeInfo", "Badge").replace(".spl__BadgeInfo.gyml", "")
            if eyedee in eyedeess: continue
            image = f"../common/assets/img/badges/{eyedee}.png"

            localizedName = {}
            try:
                for locale, ldata in locale_data.items():
                    localizedName[locale] = ldata["CommonMsg/Badge/BadgeMsg"].get(badge["MsgLabelEx"], "")
                    if "[group=0004 type=0007 params=00 00 00 00]" in localizedName[locale]:
                        localizedName[locale] = localizedName[locale].replace(
                            "[group=0004 type=0007 params=00 00 00 00]",
                            ldata["CommonMsg/Coop/CoopEnemy"][badge["Sub1_Str"]],
                        )
                    if "[group=0004 type=000e params=00 00 00 00]" in localizedName[locale]:
                        localizedName[locale] = localizedName[locale].replace(
                            "[group=0004 type=000e params=00 00 00 00]",
                            ldata["CommonMsg/Coop/CoopStageName"][badge["Sub1_Str"]],
                        )
                    if "[group=0004 type=000f params=00 00 00 00]" in localizedName[locale]:
                        localizedName[locale] = localizedName[locale].replace(
                            "[group=0004 type=000f params=00 00 00 00]",
                            ldata["CommonMsg/Gear/GearBrandName"][f"B{badge['Sub1_Int']:02}"],
                        )
                    if (
                        "[group=0004 type=0001 params=00 00 00 00]" in localizedName[locale]
                        and badge["Category"] == "WeaponLevel"
                    ):
                        weapon = next(w for w in weapons_data if w["Id"] == badge["Sub1_Int"])
                        localizedName[locale] = localizedName[locale].replace(
                            "[group=0004 type=0001 params=00 00 00 00]",
                            ldata["CommonMsg/Weapon/WeaponName_Main"][weapon["__RowId"]],
                        )
                    if (
                        "[group=0004 type=0001 params=00 00 00 00]" in localizedName[locale]
                        and badge["Category"] == "WinCount_WeaponSp"
                    ):
                        special = next(w for w in special_data if w["Id"] == badge["Sub1_Int"])
                        localizedName[locale] = localizedName[locale].replace(
                            "[group=0004 type=0001 params=00 00 00 00]",
                            ldata["CommonMsg/Weapon/WeaponName_Special"][special["__RowId"]],
                        )

                    if not localizedName[locale]:
                        localizedName[locale] = ldata["CommonMsg/Badge/BadgeMsg"][badge["Name"]]
            except KeyError:
                print(eyedee)
                continue
            name = localizedName["en_US"]

            alll.append({"name": name, "image": image, "localizedName": localizedName, "id": i, "internal": eyedee})
            eyedeess.append(eyedee)
            i += 1
    return alll


async def main():
    hats_data = await jayson(hats, VERSIONS)
    shirts_data = await jayson(shirts, VERSIONS)
    shoes_data = await jayson(shoes, VERSIONS)
    weapons_data = await jayson(weapons, VERSIONS)
    subs_data = await jayson(subs, VERSIONS)
    specials_data = await jayson(specials, VERSIONS)
    skills_data = await jayson(skills, VERSIONS)
    brands_data = await jayson(brands, VERSIONS)
    locale_data = {}
    for l, url in locale.items():
        locale_data[l] = await jayson(url)

    splashtags_data = await jayson(splashtags, VERSIONS)
    adjectives_data = await jayson(adjectives, VERSIONS)
    subjects_data = await jayson(subjects, VERSIONS)
    badges_data = await jayson(badges, VERSIONS)

    adjective_info_data = []
    for v in VERSIONS:
        inner = {}
        for l, url in adjective_info.items():
            inner[l] = await jayson(url.format(VERSION=v), byname=True)
        adjective_info_data.append(inner)
    
    subject_info_data = []
    for v in VERSIONS:
        inner = {}
        for l, url in subject_info.items():
            inner[l] = await jayson(url.format(VERSION=v), byname=True)
        subject_info_data.append(inner)

    await save("/hats.json", await gear("Hats", "Head", hats_data, locale_data))
    await save("/clothes.json", await gear("Clothes", "Clothes", shirts_data, locale_data))
    await save("/shoes.json", await gear("Shoes", "Shoes", shoes_data, locale_data))
    await save("/weapons.json", await weapon(weapons_data, locale_data))
    await save("/subs.json", await sub(subs_data, locale_data))
    await save("/specials.json", await special(specials_data, locale_data))
    await save("/skills.json", await skill(skills_data, locale_data))
    await save("/brands.json", await brand(brands_data, locale_data))

    await save("/splashtags.json", await splashtag(splashtags_data, locale_data))
    await save("/adjectives.json", await adjective(adjectives_data, locale_data, adjective_info_data))
    await save("/subjects.json", await subject(subjects_data, locale_data, subject_info_data))
    await save("/badges.json", await badge(badges_data, locale_data, weapons_data, specials_data))


asyncio.run(main())
