const tvDao = require('../DAO/tvDAO');

function create(context) {
    async function query() {
        let result = tvDao.query();
        if (result) {
            return result;
        }
    }

    async function get(id) {
        let result = await tvDao.get(id);
        if (result) {
            return result;
        }
    }

    async function createNewOrUpdate(data) {
        let result = await tvDao.createNewOrUpdate(data);
        if (result) {
            return result;
        }
    }

    return {
        query: query,
        get: get,
        createNewOrUpdate: createNewOrUpdate,
    };
}

module.exports = {
    create: create
};