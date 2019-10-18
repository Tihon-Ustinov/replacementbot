/* eslint-disable */
const mocha = require('mocha')
const { assert } = require('chai')
const Table = require('../../src/table')
describe("Тестирование таблиц", function () {
    let table = new Table('Тестовая таблица')
    let tableStub = require('../stub/teble.stub')
    it("Таблица создалась", () => {
        assert.equal(table instanceof Table, true)
        assert.equal(table.name, 'Тестовая таблица')
    })
    it('Добавление строки в таблицу', () => {
        for (let i in tableStub) {
            table.addRow()
        }
        assert.equal(table.length, tableStub.length)
    })
    it('Добавление ячеек', () => {
        for (let i in tableStub) {
            for (let cell of tableStub[i]){
                table.tr[i].addCell(cell)
                assert.equal(table.tr[i].td[table.tr[i].length - 1].value, cell)
            }
            assert.equal(table.tr[i].length, tableStub[i].length)
        }
    })
    it('Добавление и изменение названия колонок', () => {
        for (let i in tableStub[0]){
            table.addColumn(`Колонка ${i}`)
        }
        assert.equal(table.tr[0].td[0].th.length, tableStub[0].length)
        table.tr[0].td[0].th[0] = 'Измененное название'
        assert.equal(table.th[0], 'Измененное название')
    })
    it('Удаление строки', () => {
        assert.equal(table.removeRow(table.tr[4]), true)
        assert.equal(table.length, tableStub.length - 1)
    })
})