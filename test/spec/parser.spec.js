/* eslint-disable */
const mocha = require('mocha')
const { assert } = require('chai')
const Parser = require('../../src/js/parser')
const { html } = require('../stub/parser.stub')
describe("Тестирование таблиц", async () => {
  let parser = new Parser(undefined, html)
  it('Init parser', async () => {
    assert.equal(await parser.init(), true);
  });
  it('Получение таблиц', () => {
    let relationships = parser.getRelationship();
    for (let relationship of relationships) {
      let table = parser.converHtmlTableToTable(relationship.table, relationship.info.join('\n'))
      console.log(table.toString())
    }

  })

})