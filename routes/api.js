const express = require('express');

const settings = require('../module/settings');
// const trueVK = require('../module/VK');
// const libraries = require('../module/libraries');

const messageProcessing = require('../apiProcessing/messageProcessing');
const groupProcessing = require('../apiProcessing/groupProcessing');

const router = express.Router();

router.use('/', (req, res, next) => {
  switch (req.body.type) {
    case 'confirmation':
      if (req.body.group_id === settings.group_id) {
        res.send(settings.group_confirm);
      }
      break;
    case 'message_new':
    case 'message_allow':
    case 'message_deny':
      if (messageProcessing.hasOwnProperty(req.body.type)) {
        messageProcessing[req.body.type](req.body);
      }
      res.send('ok');
      break;
    case 'group_leave':
    case 'group_join':
      if (groupProcessing.hasOwnProperty(req.body.type)) {
        groupProcessing[req.body.type](req.body);
      }
      res.send('ok');
      break;
    case 'vkpay_transaction':
      // TODO: Платеж через вк pay
      break;
    default:
      next();
      break;
  }
});

// router.post('/', function(req, res, next) {
//     console.log(settings.GROUP_TOKEN);
//     console.log(req.body);
//     switch (req.body.type)
//     {
//         case 'confirmation':
//             if (req.body.group_id === 144267450)
//                 res.send("d01e4ee6");
//             break;
//         case 'message_new':
//             var userId = req.body.object.user_id;
//             let message = "";
//             if (req.body.object.body.search(/замена/iu) === 0)
//             {
//             let group = req.body.object.body.split(' ')[1]+" "+req.body.object.body.split(' ')[2] ;
//             libraries.parser.getHTML('www.chtotib.ru/studentu/zamena')
//                 .then(res => {
//                     let $ = libraries.cheerio.load(res.result);
//                     try {
//                         let replacementDateFirst = "", replacementDateSecond = "";
//                         let p = 0;
//                         for (let table = 0; table < $('table>tbody').length; table++)
//                         {
//                             for (; p< $('div.content>div.wrap').find('strong').length; p++)
//                             {
//                                 let children = $('div.content>div.wrap').find('strong')[p].children;
//                                 for (let child = 0; child < children.length; child++)
//                                 {
//                                     if (children[child].type === "text")
//                                     {
//                                         if (children[child].data.search(/З А М Е Н А/gmui) === 0)
//                                         {
//                                             if (replacementDateFirst === "") replacementDateFirst = children[child].data;
//                                             else replacementDateSecond = children[child].data + " " + children[child].parent.parent.next.next.children[1].children[0].data;
//                                             break;
//                                         }
//                                     }
//                                 }
//                                 if (replacementDateSecond.length > 0) break;
//                             }
//                             if (table === 0) console.log(replacementDateFirst);
//                             else if (table === 1) console.log(replacementDateSecond);
//                             let tbody = libraries.cheerio($('table>tbody')[table]);
//                             let childROW = tbody.children();
//                             let prevGroup = "";
//                             for (let row = 0; row < childROW.length; row++)
//                             {
//                                 let rowSTR = "";
//
//                                 let childDEC = childROW[row].children;
//                                 for (let dec = 0; dec < childROW[row].children.length; dec++)
//                                 {
//                                     if (childDEC[dec].type === 'tag')
//                                     {
//                                         if (childDEC[dec].children[1].children[1] !== undefined)
//                                         {
//                                             if (childDEC[dec].children[1].children[1].children[0].data.search(/^[а-я]+ ?[0-9]+.[0-9а-я]+$/gmui) === 0) prevGroup = childDEC[dec].children[1].children[1].children[0].data;
//                                             rowSTR += childDEC[dec].children[1].children[1].children[0].data+";";
//                                         }
//                                         else rowSTR += prevGroup+";";
//                                     }
//                                 }
//                                 let groupRow = rowSTR.split(';')[0].toLowerCase();
//                                 console.log(groupRow.trim());
//                                 console.log(group.toLowerCase().trim());
//                                 if (group.toLowerCase().trim() === groupRow.trim())
//                                 {
//                                     message += rowSTR + "\n";
//                                     if (table === 0)
//                                         if (message.indexOf(replacementDateFirst) === -1) message = replacementDateFirst + "\n" + message;
//
//                                     if (table === 1)
//                                         if (message.indexOf(replacementDateSecond) === -1) message = replacementDateSecond + "\n" + message;
//
//                                 }
//                             }
//                         }
//                         console.log(message);
//                         message = message.replace(/;/guim, ' ');
//                         let reg = new RegExp("/"+group+"/guim", "guim");
//                         message = message.replace(reg, ' ');
//                         if (message.length === 0)
//                             trueVK.VK.request('messages.send', {'user_id' : userId, 'message':"Не найдено такой группы, либо для этой группы нет замен"}, function(_o) {
//                                 console.log(_o);
//                             });
//                         else
//                             trueVK.VK.request('messages.send', {'user_id' : userId, 'message':message}, function(_o) {
//                                 console.log(_o);
//                             });
//
//
//                     }catch (e) {
//                         console.log(e);
//                         trueVK.VK.request('messages.send', {'user_id' : userId, 'message':"Произошла ошибка, попробуйте еще раз"}, function(_o) {
//                             console.log(_o);
//                         });
//                     }
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     trueVK.VK.request('messages.send', {'user_id' : userId, 'message':"Произошла ошибка, попробуйте еще раз"}, function(_o) {
//                         console.log(_o);
//                     });
//                 });
//
//             }
//             else
//             {
//                 trueVK.VK.request('messages.send', {'user_id' : userId, 'message':'Прости, но в данный момент я могу сказать замену только ту которая есть на сайте, писать нужно так "замена группа" (например: замена ПКС 14-1) :(\n\rБот будет переписываться с нуля.\n\rЕсли ты знаешь Node.js и C# и хочешь помочь то напиши [id255983286|мне]'}, function(_o) {
//                     console.log(_o);
//                     trueVK.VK.request('messages.send', {'user_id' : userId, 'sticker_id':'6045'}, function(_o_2) {
//                         console.log(_o_2);
//                     });
//                 });
//             }
//
//
//             res.send('ok');
//             break;
//         default:
//             next();
//             break;
//     }
// });


module.exports = router;
