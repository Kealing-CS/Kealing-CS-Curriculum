const { QuickDB } = require("quick.db");


module.exports = class LevelManager {
    constructor() {
        this.levelDB = new QuickDB({ filePath: './db/levelinformation.db'});
    }
    
    // get the required languages for a level
    async getRequiredLanguages(level) {
        return await this.levelDB.get(`${level}.requiredLanguages`);
    }

    // get the correct logs for a level
    async getCorrectLogs(level) {
        return await this.levelDB.get(`${level}.correctLogs`);
    }

    // get the base code for a level
    async getBaseCode(level) {
        return await this.levelDB.get(`${level}.baseCode`);
    }

    // get the parents for a level
    async getParents(level) {
        return await this.levelDB.get(`${level}.parents`);
    }

    // get the instructions of a level
    async getInstructions(level) {
        return await this.levelDB.get(`${level}.instructions`);
    }

    // check if a level exists
    async levelExists(level) {
        return await this.levelDB.has(level);
    }

    // get all levels
    async getAll() {
        return await this.levelDB.all();
    }

    // set a level (create and update)
    setLevel(id, name, parents, instructions, baseCode, correctLogs, position) {
        this.levelDB.set(id, {
            id: id,
            name: name,
            parents: parents,
            instructions: instructions,
            baseCode: baseCode,
            correctLogs: correctLogs,
            position: position
        }); 
    }

    // delete a level
    deleteLevel(id) {
        this.levelDB.delete(id);
    }

    // get all of a levels info
    async getLevel(id) {
        return await this.levelDB.get(id);
    }
}