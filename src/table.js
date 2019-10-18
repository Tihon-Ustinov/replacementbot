'use strict';
const Table = class Table {
    constructor(name) {
        this.name = name
        this.tr = []
        this.th = []
        this.__joinSimbol = '\n'
    }
    addColumn(name) {
        this.th.push(name)
        return true
    }
    addRow(row = null) {
        if (row instanceof Row) return this.tr.push(row)
        else return this.tr.push(new Row(this))
    }
    removeRow(arg) {
        let id = arg
        if (arg instanceof Row) {
            id = this.tr.indexOf(arg)
        }
        return this.tr[id].destruct() && !!this.tr.splice(id, 1)
    }
    toString() {
        return this.tr.map(tr => tr.toString()).join(this.__joinSimbol)
    }
    get length() {
        return this.tr.length
    }
    destruct() {
        return this.tr.every(tr => tr.destruct()) || Object.keys(this).forEach(key => this[key] = null)
    }
}
class Row {
    constructor(parent) {
        if (!(parent instanceof Table)) {
            // TODO: Выброс ошибки наверное
            throw new Error('Ошибка! Несоответствие типа родителя')
        }
        this.parent = parent
        this.id = parent.length > 0 ? parent.tr[parent.tr.length - 1].id + 1 : 0
        this.td = []
        this.__joinSimbol = ' '
    }
    get length () {
        return this.td.length
    }
    addCell(value) {
        if (value instanceof Cell) return this.td.push(value)
        else return this.td.push(new Cell(value, this))
    }
    get th() {
        return this.parent.th
    }
    set th(value) {
        return this.parent.th = value
    }
    removeCell (arg) {
        let id = arg
        if (arg instanceof Cell) {
            id = this.td.indexOf(arg)
        }
        if (typeof id !== 'number' || id < 0) return false
        return this.td[id].destruct() && !!this.td.splice(id, 1)
    }
    toString() {
        return this.td ? this.td.map(tr => tr.toString()).join(this.__joinSimbol) : ''
    }
    destruct() {
        return this.td.every(td => td.destruct()) || Object.keys(this).forEach(key => this[key] = null)
    }
}
class Cell {
    constructor(value, parent) {
        if (!(parent instanceof Row)) {
            // TODO: Выброс ошибки наверное
            throw new Error('Ошибка! Несоответствие типа родителя')
        }
        this.parent= parent
        this.id = parent.length > 0 ? parent.td[parent.length - 1].id + 1: 0
        this.value = value.toString()
    }
    toString() {
        return this.value ? this.value : ''
    }
    get length() {
        return this.value.length
    }
    get th() {
        return this.parent.th
    }
    set th(value) {
        return this.parent.th = value
    }
    destruct() {
        for(let key of Object.keys(this)) {
            this[key] = null
        }
        return true
    }
}
module.exports = Table