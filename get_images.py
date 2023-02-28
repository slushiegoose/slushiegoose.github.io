from pathlib import Path
import traceback
import aiohttp

try:
    from tqdm import tqdm
except ImportError:
    tqdm = lambda i: i


# TODO - 099 -> latest

VERSION = "300"

hats = f"https://leanny.github.io/splat3/data/mush//{VERSION}/GearInfoHead.json"
shirts = f"https://leanny.github.io/splat3/data/mush//{VERSION}/GearInfoClothes.json"
shoes = f"https://leanny.github.io/splat3/data/mush//{VERSION}/GearInfoShoes.json"
weapons = f"https://leanny.github.io/splat3/data/mush//{VERSION}/WeaponInfoMain.json"
subs = f"https://leanny.github.io/splat3/data/mush//{VERSION}/WeaponInfoSub.json"
specials = f"https://leanny.github.io/splat3/data/mush//{VERSION}/WeaponInfoSpecial.json"
brands = f"https://leanny.github.io/splat3/data/parameter//{VERSION}/misc/spl__BrandTraitsParam.spl__BrandTraitsParam.json"
skills = f"https://leanny.github.io/splat3/data/parameter//{VERSION}/misc/spl__GearSkillTraitsParam.spl__GearSkillTraitsParam.json"
locale = "https://leanny.github.io/splat3/data/language/EUen.json"


splashtags = f"https://leanny.github.io/splat3/data/mush//{VERSION}/NamePlateBgInfo.json"
adjectives = f"https://leanny.github.io/splat3/data/mush//{VERSION}/BynameAdjectiveInfo.json"
subjects = f"https://leanny.github.io/splat3/data/mush//{VERSION}/BynameSubjectInfo.json"
badges = f"https://leanny.github.io/splat3/data/mush//{VERSION}/BadgeInfo.json"


hats_path = Path("common", "assets", "img", "gear", "hats")
clothes_path = Path("common", "assets", "img", "gear", "clothes")
shoes_path = Path("common", "assets", "img", "gear", "shoes")
weapons_path = Path("common", "assets", "img", "weapons")
subspe_path = Path("common", "assets", "img", "subspe")
brand_path = Path("common", "assets", "img", "brands")
skill_path = Path("common", "assets", "img", "skills")
splashtag_path = Path("common", "assets", "img", "splashtags")
badge_path = Path("common", "assets", "img", "badges")


async def json(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()


async def get(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.read(), resp.status


async def download(directory: Path, file_name: str, url: str):
    data, status = await get(url)
    if status > 299:
        return
    name = "{}.png".format(file_name)
    path = directory / name
    with path.open("wb") as file:
        file.write(data)


async def hat(listie, locale_data):
    for hats_piece in tqdm(listie):
        eyedee = hats_piece["__RowId"]

        url = f"https://leanny.github.io/splat3/images/gear/{eyedee}.png"

        name = eyedee

        await download(hats_path, name, url)


async def shirt(listie, locale_data):
    for shirts_piece in tqdm(listie):
        eyedee = shirts_piece["__RowId"]

        url = f"https://leanny.github.io/splat3/images/gear/{eyedee}.png"

        name = eyedee

        await download(clothes_path, name, url)


async def shoe(listie, locale_data):
    for shoes_piece in tqdm(listie):
        eyedee = shoes_piece["__RowId"]

        url = f"https://leanny.github.io/splat3/images/gear/{eyedee}.png"

        name = eyedee

        await download(shoes_path, name, url)


async def weapon(listie, locale_data):
    for wpn in tqdm(listie):
        eyedee = wpn["__RowId"]

        url = f"https://leanny.github.io/splat3/images/weapon_flat/Path_Wst_{eyedee}.png"

        try:
            name = eyedee
        except KeyError:
            print(eyedee)
            continue

        await download(weapons_path, name, url)


async def subspe(listie, locale_data, suffix):
    for subspec in tqdm(listie):
        try:
            eyedee = subspec["__RowId"]

            url = f"https://leanny.github.io/splat3/images/subspe/Ws{suffix}_{eyedee}00.png"


            try:
                name = f"Ws{suffix}_{eyedee}"
            except KeyError:
                print(eyedee)
                continue

            await download(subspe_path, name, url)
        except:
            traceback.print_exc()

async def brand(listie, locale_data):

    listie = listie["Traits"]

    listie = [{"__RowId": key, **value} for key, value in listie.items()]


    for brand in tqdm(listie):
        eyedee = brand["__RowId"]

        url = f"https://leanny.github.io/splat3/images/brand/{eyedee}.png"

        name = eyedee

        await download(brand_path, name, url)

async def skill(listie, locale_data):

    listie = listie["Traits"]

    listie = [{"__RowId": key, **value} for key, value in listie.items()]

    for skill in tqdm(listie):
        eyedee = skill["__RowId"]

        url = f"https://leanny.github.io/splat3/images/skill/{eyedee}.png"

        name = eyedee

        await download(skill_path, name, url)

async def splashtag(listie, locale_data):
    for tag in tqdm(listie):
        eyedee = tag["__RowId"]

        url = f"https://leanny.github.io/splat3/images/npl/{eyedee}.png"

        try:
            name = eyedee
        except KeyError:
            print(eyedee)
            continue

        await download(splashtag_path, name, url)

async def badge(listie, locale_data):
    for bad in tqdm(listie):
        eyedee = bad["__RowId"]
        eyedee = eyedee.replace("Work/Gyml/BadgeInfo", "Badge").replace(".spl__BadgeInfo.gyml", "")

        url = f"https://leanny.github.io/splat3/images/badge/{eyedee}.png"

        try:
            name = eyedee
        except KeyError:
            print(eyedee)
            continue

        await download(badge_path, name, url)


async def main():

    hats_data = await json(hats)
    shirts_data = await json(shirts)
    shoes_data = await json(shoes)
    weapons_data = await json(weapons)
    subs_data = await json(subs)
    specials_data = await json(specials)
    brands_data = await json(brands)
    skills_data = await json(skills)
    locale_data = await json(locale)

    splashtags_data = await json(splashtags)
    adjectives_data = await json(adjectives)
    subjects_data = await json(subjects)
    badges_data = await json(badges)

    print("Getting hats...")
    await hat(hats_data, locale_data)

    print("Getting shirts...")
    await shirt(shirts_data, locale_data)

    print("Getting shoes...")
    await shoe(shoes_data, locale_data)

    print("Getting weapons...")
    await weapon(weapons_data, locale_data)

    print("Getting subs...")
    await subspe(subs_data, locale_data, "b")

    print("Getting specials...")
    await subspe(specials_data, locale_data, "p")

    print("Getting brands...")
    await brand(brands_data, locale_data)

    print("Getting skills...")
    await skill(skills_data, locale_data)

    print("Getting splashtags...")
    await splashtag(splashtags_data, locale_data)

    print("Getting badges...")
    await badge(badges_data, locale_data)


import asyncio

asyncio.run(main())
