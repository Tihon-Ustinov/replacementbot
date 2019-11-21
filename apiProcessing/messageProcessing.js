// TODO: добавить базу данных
const db = require('../database/abstracrDatabase');
const vk = require('../module/VK');
const Parser = require('../src/js/parser');
const clearCharts = [
  {i: 'c', o: 'с'},
  {i: 'o', o: 'о'},
  {i: '&nbsp;', o: ' '},
];
module.exports = {
  message_new: async (body) => {
    return new Promise(async (resolve, reject) => {
      // TODO: Реализовать парсинг
      const argsCommand = body.object.body.trim().split(' ');
      switch (argsCommand[0].toLowerCase()) {
        case 'замена':
          const replacementParser = new Parser('http://www.chtotib.ru/studentu/zamena');
          await replacementParser.init();
          const relationships = replacementParser.getRelationship();
          let groupName = '';
          for (const arg of argsCommand) {
            if (arg !== argsCommand[0]) {
              groupName += (arg.length > 0 && arg !== ' ') ? arg.toUpperCase() + (arg != argsCommand[argsCommand.length - 1] ? '-' : '') : '';
            }
          }
          if (groupName.length === 0) {
            vk.VK.request('messages.send', {'user_id': body.object.user_id, 'message': 'Я не ванга! Группу напиши!'}, function(_o) {
              console.log(_o);
            });
            break;
          }
          groupName = groupName.toUpperCase();
          for (let i = 0; i < clearCharts.length; i++) {
            clearCharts[i].i = clearCharts[i].i.toUpperCase();
            clearCharts[i].o = clearCharts[i].o.toUpperCase();
          }
          let result = [];
          for (const relationship of relationships) {
            const table = replacementParser.converHtmlTableToTable(relationship.table, relationship.info.join('\n'));
            clearCharts.forEach((val) => {
              while (~groupName.indexOf(val.i)) {
                groupName = groupName.replace(val.i, val.o);
              }
            });
            result = result.concat(table.tr.filter((tr) => {
              tr.td[0].value = tr.td[0].value.toUpperCase();
              clearCharts.forEach((val) => {
                while (~tr.td[0].value.indexOf(val.i)) {
                  tr.td[0].value = tr.td[0].value.replace(val.i, val.o);
                }
              });
              return tr.td[0].value.split(' ').join('-') === groupName;
            }));
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
