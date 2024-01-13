const { QuickDB } = require("quick.db");


module.exports = class LevelManager {
    constructor() {
        this.levelDB = new QuickDB({ filePath: './db/levelinformation.db'});
    }
    
    async getRequiredLanguages(level) {
        return await this.levelDB.get(`${level}.requiredLanguages`);
    }

    async getCorrectLogs(level) {
        return await this.levelDB.get(`${level}.correctLogs`);
    }

    async getBaseCode(level) {
        return await this.levelDB.get(`${level}.baseCode`);
    }

    async getParents(level) {
        return await this.levelDB.get(`${level}.parents`);
    }

    async getInstructions(level) {
        return await this.levelDB.get(`${level}.instructions`);
    }

    async levelExists(level) {
        return await this.levelDB.has(level);
    }

    async getAll() {
        return await this.levelDB.all();
    }

    setLevel(id, name, parents, instructions, needs, baseCode, correctLogs, position) {
        this.levelDB.set(id, {
            id: id,
            name: name,
            parents: parents,
            instructions: instructions,
            requiredLanguages: needs,
            baseCode: baseCode,
            correctLogs: correctLogs,
            position: position
        }); 
    }

    deleteLevel(id) {
        this.levelDB.delete(id);
    }

    async getLevel(id) {
        return await this.levelDB.get(id);
    }
}