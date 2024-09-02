import fs from 'node:fs'
import path from 'node:path'

const baseGameFolders = ["nsz/base", 'sparse', 'xcz', 'xci']; // Folders where games are in directly
const updateFolders = ["nsz/updates"]; // Folders where updates are in directly
const dlcFolders = ["nsz/dlc"]; // Folders where dlc are in directly
const retroFolders = ["forwarders"]; // Folders where retroarch stuff is in directly

(async () => {
    const startTime = Date.now()
    let gamesDB = { games: {}, updates: {}, dlc: {}, forwarders: {} };

    console.log("Cooking the database, go grab a coffee or something...");

    let switchGameInfos = null

    await fetch('https://raw.githubusercontent.com/blawar/titledb/master/US.en.json')
        .then(response => response.text())
        .then(async (data) => {
            switchGameInfos = await JSON.parse(data)
        });

    console.log("Loaded switch game infos, now processing base games...");

    ///////////////////////////////////////////
    //// Processing base games
    ///////////////////////////////////////////
    for await (const folder of baseGameFolders) {
        const dirPath = path.join(Bun.env.MOUNT_PATH, folder)
        for (const file of fs.readdirSync(dirPath)) {
            try {
                if (fs.lstatSync(path.join(dirPath, file)).isDirectory())
                    continue
                const fileFormat = file.split('.').pop()
                if (fileFormat.toLowerCase() !== 'nsp' && fileFormat.toLowerCase() !== 'nsz' && fileFormat.toLowerCase() !== 'xcz' && fileFormat.toLowerCase() !== 'xci')
                    continue
                const filePath = path.join(dirPath, file)
                const fileName = file.split('.').slice(0, -1).join('.')
                const parts = file.split('[')
                const tid = parts[parts.length - 2].slice(0, -5)
                const resID = parts[parts.length - 2].slice(0, -1)
                const name = parts[parts.length - 3].slice(0, -1)
                const fileSize = fs.statSync(filePath).size
                const gameInDB = Object.values(switchGameInfos).find(item => item.id === resID) || null;
                const description = gameInDB ? gameInDB.description : null
                if (!gamesDB.games[tid]) {
                    gamesDB.games[tid] = { name: name, description: description, files: [] }
                }
                gamesDB.games[tid].files.push({
                    resID: resID,
                    format: fileFormat,
                    fileName: fileName,
                    path: filePath,
                    size: fileSize
                })
            } catch (error) {
                // console.log(error)
                console.log("Error processing game: " + dirPath + "/" + file)
            }
        }
    }

    console.log("Base games processed, now processing updates...");

    ///////////////////////////////////////////
    //// Processing updates
    ///////////////////////////////////////////
    for await (const folder of updateFolders) {
        const dirPath = path.join(Bun.env.MOUNT_PATH, folder)
        for (const file of fs.readdirSync(dirPath)) {
            try {
                if (fs.lstatSync(path.join(dirPath, file)).isDirectory())
                    continue
                const fileFormat = file.split('.').pop()
                const name = file.split('.').slice(0, -1).join('.')
                if (fileFormat.toLowerCase() !== 'nsp' && fileFormat.toLowerCase() !== 'nsz' && fileFormat.toLowerCase() !== 'xcz' && fileFormat.toLowerCase() !== 'xci')
                    continue
                const filePath = path.join(dirPath, file)
                const parts = file.split('[')
                const tid = parts[parts.length - 2].slice(0, -5)
                const resID = parts[parts.length - 2].slice(0, -1)
                const version = parts[parts.length - 1].slice(0, -5);
                const fileSize = fs.statSync(filePath).size
                if (!gamesDB.updates[tid]) {
                    gamesDB.updates[tid] = { gameName: gamesDB.games[tid] ? gamesDB.games[tid].name : "No name", baseGameResID: gamesDB.games[tid] ? gamesDB.games[tid].files[0].resID : "No base game found", files: [] }
                }
                gamesDB.updates[tid].files.push({
                    fileName: name,
                    resID: resID,
                    version: version,
                    format: fileFormat,
                    path: filePath,
                    size: fileSize
                })
            }
            catch (error) {
                // console.log(error)
                console.log("Error processing update: " + dirPath + "/" + file)
            }
        }
    }

    console.log("Updates processed, now processing DLCs...");

    ///////////////////////////////////////////
    //// Processing DLCs
    ///////////////////////////////////////////
    for await (const folder of dlcFolders) {
        const dirPath = path.join(Bun.env.MOUNT_PATH, folder)
        for (const file of fs.readdirSync(dirPath)) {
            try {
                if (fs.lstatSync(path.join(dirPath, file)).isDirectory())
                    continue
                const fileFormat = file.split('.').pop()
                const name = file.split('.').slice(0, -1).join('.')
                if (fileFormat.toLowerCase() !== 'nsp' && fileFormat.toLowerCase() !== 'nsz' && fileFormat.toLowerCase() !== 'xcz' && fileFormat.toLowerCase() !== 'xci')
                    continue
                const filePath = path.join(dirPath, file)
                const parts = file.split('[')
                const tid = parts[parts.length - 2].slice(0, -5)
                const resID = parts[parts.length - 2].slice(0, -1)
                const fileSize = fs.statSync(filePath).size
                if (!gamesDB.dlc[tid]) {
                    gamesDB.dlc[tid] = { gameName: gamesDB.games[tid] ? gamesDB.games[tid].name : "No name", baseGameResID: gamesDB.games[tid] ? gamesDB.games[tid].files[0].resID : "No base game found", files: [] }
                }
                gamesDB.dlc[tid].files.push({
                    fileName: name,
                    resID: resID,
                    format: fileFormat,
                    path: filePath,
                    size: fileSize
                })
            }
            catch (error) {
                // console.log(error)
                console.log("Error processing DLC: " + dirPath + "/" + file)
            }
        }
    }

    console.log("DLCs processed, now processing forwarders...");

    ///////////////////////////////////////////
    //// Processing forwarders
    ///////////////////////////////////////////
    for await (const folder of retroFolders) {
        for await (const gameConsole of fs.readdirSync(path.join(Bun.env.MOUNT_PATH, folder))) {
            gamesDB.forwarders[gameConsole] = {}
            const dirPath = path.join(Bun.env.MOUNT_PATH, folder, gameConsole)
            for await (const file of fs.readdirSync(dirPath)) {
                // console.log(file)
                try {
                    if (fs.lstatSync(path.join(dirPath, file)).isDirectory())
                        continue
                    const fileFormat = file.split('.').pop()
                    if (fileFormat.toLowerCase() !== 'nsz')
                        continue
                    const filePath = path.join(dirPath, file)
                    const fileSize = fs.statSync(filePath).size
                    const fileName = file.split('.').slice(0, -1).join('.')
                    const parts = file.split('[')
                    const name = parts[parts.length - 2].slice(0, -5)
                    const resID = parts[parts.length - 1].slice(0, -5)
                    const tid = parts[parts.length - 1].slice(0, -9)
                    if (!gamesDB.forwarders[gameConsole][tid]) {
                        gamesDB.forwarders[gameConsole][tid] = { name: name, files: [] }
                    }
                    gamesDB.forwarders[gameConsole][tid].files.push({
                        resID: resID,
                        format: fileFormat,
                        fileName: fileName,
                        path: filePath,
                        size: fileSize
                    })
                }
                catch (error) {
                    // console.log(error)
                    console.log("Error processing forwarder: " + dirPath + "/" + file)
                }
            }
        }
    }

    console.log("Forwarders processed, now saving the database...");

    await fs.writeFileSync('gamesDB.json', JSON.stringify(gamesDB, null, 2))
    await fs.writeFileSync('gamesDB.min.json', JSON.stringify(gamesDB))

    const time = (Date.now() - startTime) / 1000
    console.log("Done! Database is ready! (It took " + time + " seconds)");

    if (time < 90)
        console.log("It was probably faster than you drinking your coffee. Impressed?");


})();
