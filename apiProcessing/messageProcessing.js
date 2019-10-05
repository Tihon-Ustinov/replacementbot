// TODO: добавить базу данных
const db = require('../database/abstracrDatabase')

module.exports = {
    message_new: async (body) => {
        return new Promise ((resolve, reject) => {
            // TODO: Реализовать парсинг

        })
    },
    message_allow: async (body) => {
        return new Promise (async (resolve, reject) => {
            // TODO: передать данные пользователя
            let result = await db.add.user(body)
            if (result.success) resolve(result)
            else reject(result)
        })
    },
    message_deny: async (body) => {
        return new Promise( async (resolve, reject) => {
            // TODO: передать данные пользователя
            let result = await db.remove.user(body)
            if (result.success) resolve(result)
            else reject(result)
        })
    }
}
