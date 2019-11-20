// TODO: добавить базу данных
const db = require('../database/abstracrDatabase');
const vk = require('../module/VK');
const Parser = require('../src/js/parser');
const clearCharts = [
  {i: 'c', o: 'с'},
  {i: 'o', o: 'о'},
];
module.exports = {
  message_new: async (body) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
      // TODO: Реализовать парсинг
      const argsCommand = body.object.body.split(' ');
      switch (argsCommand[0].toLowerCase()) {
        case 'замена':
          const replacementParser = new Parser('http://www.chtotib.ru/studentu/zamena');
          await replacementParser.init();
          const relationships = replacementParser.getRelationship();
          let groupName = '';
          for (const arg of argsCommand) {
            if (arg !== argsCommand[0]) {
              groupName += arg.toUpperCase() + '-';
            }
          }
          groupName = groupName.slice(0, groupName.length-1);
          let result = [];
          for (const relationship of relationships) {
            const table = replacementParser.converHtmlTableToTable(relationship.table, relationship.info.join('\n'));
            clearCharts.forEach((val) => {
              while (~groupName.indexOf(val.i)) {
                groupName = groupName.replace(val.i.toUpperCase(), val.o.toUpperCase);
              }
            });
            result = table.tr.filter((tr) => {
              clearCharts.forEach((val) => {
                while (~tr.td[0].value.indexOf(val.i)) {
                  tr.td[0].value = tr.td[0].value.replace(val.i.toUpperCase(), val.o.toUpperCase);
                }
              });
              return tr.td[0].value.split(' ').join('-') === groupName
            });
            if (result.length > 0) {
              vk.VK.request('messages.send', {'user_id': body.object.user_id, 'message': relationship.info.join('\n\r')}, function(_o) {
                console.log(_o);
              });
            }
          }
          result.forEach((row) => {
            vk.VK.request('messages.send', {'user_id': body.object.user_id, 'message': row.toString()}, function(_o) {
              console.log(_o);
            });
          });
          if (result.length === 0) {
            const date = [];
            relationships
                .map((r) => r.info)
                .forEach((i) => {
                  for (let str of i) {
                    str = str.replace('.', '');
                    if (!~date.indexOf(str) && str[0] === str[0].toLowerCase()) {
                      date.push(str);
                    }
                  }
                });
            console.log(date);
            vk.VK.request('messages.send', {'user_id': body.object.user_id, 'message': date.join(' и ') + '\n\rнет замен'}, function(_o) {
              console.log(_o);
            });
          }
          break;
        case 'помощь':
          vk.VK.request('messages.send', {'user_id': body.object.user_id, 'message': 'Не скажу'}, function(_o) {
            console.log(_o);
          });
          break;
        default:
          break;
      }
    });
  },
  message_allow: async (body) => {
    return new Promise(async (resolve, reject) => {
      // TODO: передать данные пользователя
      const result = await db.add.user(body);
      if (result.success) resolve(result);
      else reject(result);
    });
  },
  message_deny: async (body) => {
    return new Promise( async (resolve, reject) => {
      // TODO: передать данные пользователя
      const result = await db.remove.user(body);
      if (result.success) resolve(result);
      else reject(result);
    });
  },
};
