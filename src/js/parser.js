'use strict';
const needle = require('needle');
const cheerio = require('cheerio');
const Table = require('./tableModel');
// const needle = require('needle');
// async function GetHTML(url) {
//   const result = {status: 'err', result: ''};
//   await needle('get', url)
//       .then((req)=>{
//         result.status = 'ok';
//         result.result = req.body;
//       })
//       .catch((err) => {
//         console.log(err);
//         result.result = err;
//       });
//   return result;
// }
/**
 * @description Скласс парсинга html с интернета или локально
 * @param {String} url - url сайта с которого получить данне
 * @param {String} data - html данные
 * @type {Parser}
 */
const Parser = class Parser {
  constructor(url = '', data = '') {
    this.__html = data;
    this.url = url;
    this.request = undefined;
    this.get = cheerio.load(data);
    this.hideString = ['З А М Е Н А', '4 КОРПУС', 'ГЛАВНЫЙ КОРПУС'];
  }
  init() {
    return new Promise(async (resolve) => {
      if (!this.url) resolve(true);
      this.request = await needle('get', this.url);
      if (this.request.statusCode === 200) {
        this.html = this.request.body;
        this.get = cheerio.load(this.html);
        resolve(true);
      }
      resolve(false);
    });
  }
  set html(value) {
    this.__html = value;
    this.get = cheerio.load(value);
  }
  get html() {
    return this.__html;
  }
  getRelationship() {
    const allTable = this.get('body>#main>#content').find('table');
    const result = [];
    for (const table of Array.from(allTable).reverse()) {
      const info = new Set();
      let currentElement = table.prev;
      while (currentElement && currentElement.name !== 'h1') {
        const temp = this.getText(currentElement).replace('\n', '').replace('\t', '');
        if (temp.length > 1 && !result.some((map) => map.info.includes(temp))) {
          info.add(temp);
        }
        currentElement = currentElement.prev;
      }
      currentElement = table.next;
      while (currentElement && currentElement.name !== 'table') {
        const temp = this.getText(currentElement).replace('\n', '').replace('\t', '');
        if (temp.length > 1 && !result.some((map) => map.info.includes(temp))) {
          info.add(temp);
        }
        currentElement = currentElement.next;
      }
      result.push({info: Array.from(info)
          .map((str) => {
            this.hideString.forEach((hideStr) => {
              str = str.replace(hideStr, '').trim();
            });
            return str;
          })
          .filter((str) => str.length > 0)
          .sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
          }), table: table});
    }
    return result;
  }
  getNotEmptyCells(cells) {
    let notEmptyCells = 0;
    for (let c = 0; c < cells.length; c++) {
      if (this.getText(cells[c]).replace(/\n|\t/gui, '').trim().length > 0) notEmptyCells++;
    }
    return notEmptyCells;
  }
  converHtmlTableToTable(htmlTable, name) {
    const table = new Table(name);
    const tbody = htmlTable.children.find((child) => child.name === 'tbody');
    if (tbody) {
      const rows = tbody.children.filter((child) => child.name === 'tr');
      for (let indexRow = 0; indexRow < rows.length; indexRow++) {
        const cells = rows[indexRow].children.filter((child) => child.name === 'td');
        for (let indexCell = 0; indexCell < cells.length; indexCell++) {
          if (indexRow === 0) {
            table.addColumn(this.getText(cells[indexCell]).trim());
          } else {
            if (indexCell === 0) table.addRow();
            let value = this.getText(cells[indexCell]).trim();
            value = value.replace(/\n|\t/gui, '_');
            value = this.replace(value, '__', '_');
            table.tr[table.length - 1].addCell(value);
          }
        }
        if (table.length && table.tr[table.length - 1].td.some((td) => ~td.value.indexOf('_'))) {
          const splitValues = this.splitGroup(table.tr[table.length - 1].td.map((td) => td.value));
          if (splitValues.length > 1) {
            table.removeRow(table.length - 1);
            for (let indexSplit = 0; indexSplit < splitValues.length; indexSplit++) {
              table.addRow();
              for (let indexCell = 0; indexCell < splitValues[indexSplit].length; indexCell++) {
                table.tr[table.length - 1].addCell(splitValues[indexSplit][indexCell]);
              }
            }
          }
        }
      }
    }
    for (let r = 1; r < table.length; r++) {
      if (table.tr[r].td[0].value.length === 0) {
        table.tr[r].td[0].value = table.tr[r - 1].td[0].value;
      }
      if (table.tr[r].td.length < table.tr[r - 1].td.length) {
        table.copyCell(table.tr[r - 1].td[0], table.tr[r]);
      }
    }
    return table;
  }
  splitGroup(arr) {
    const result = [];
    if (arr.some((val) => val.indexOf('_'))) {
      let maxLen = 0;
      arr.forEach((val) => {
        const s = val.split('_').length;
        maxLen = s > maxLen ? s : maxLen;
      });
      while (maxLen) {
        result.push([]);
        maxLen--;
      }
      for (let i = 0; i < arr.length; i++) {
        const split = arr[i].split('_');
        for (let rIndex = 0; rIndex < result.length; rIndex++) {
          if (split[rIndex]) {
            result[rIndex].push(split[rIndex]);
          } else {
            result[rIndex].push(split[0] ? split[0] : '');
          }
        }
      }
    }
    return result;
  }
  getForTagName(obj, tagName, direction = 'next') {
    let currentElement = obj;
    while (currentElement) {
      if (currentElement.name === tagName) return currentElement;
      currentElement = currentElement[direction];
    }
    return currentElement;
  }
  getText(element, result = '') {
    if (!element) return result;
    if (element.type === 'text') result += element.data;
    if (element.children) {
      for (const children of Array.from(element.children)) {
        result = this.getText(children, result);
      }
    }
    return result;
  }
  replace(input, search, replace = '') {
    while (~input.indexOf(search)) {
      input = input.replace(search, replace);
    }
    return input;
  }
  isInit() {
    return this.html.length > 0;
  }
};

module.exports = Parser;
