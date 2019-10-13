import React from 'react';
import classNames from 'classnames'

import {createEmptyCanvas} from '../Canvas/utils'
import Canvas from '../Canvas/Canvas'
import {randomInt} from '../utils'

import './Minesweeper.scss'

const SIZE = 20

class Minesweeper extends React.Component {
    constructor(props) {
        super(props)

        const mineCount = 50;

        this.state = {
            canvas: this.generateCanvasWithMines(mineCount),
            mineCount
        }
    }

    getNeighbourCoord = (coord) => {
        const newCoord = [
            { x: coord.x - 1, y: coord.y },
            { x: coord.x - 1, y: coord.y - 1 },
            { x: coord.x, y: coord.y - 1 },
            { x: coord.x + 1, y: coord.y - 1 },
            { x: coord.x + 1, y: coord.y },
            { x: coord.x + 1, y: coord.y + 1 },
            { x: coord.x, y: coord.y + 1 },
            { x: coord.x - 1, y: coord.y + 1 },
        ]
        return newCoord.filter(c => c.x >= 0 && c.x < SIZE && c.y >= 0 && c.y < SIZE)
    }

    calculateNumberOfNeighbourMine = (canvas, cell, coord) => {
        if (canvas[coord.y][coord.x].value > -1) {
            cell.value = this.getNeighbourCoord(coord)
                .map(c => {
                    if (canvas[c.y][c.x].value === -1) return 1
                    return 0
                })
                .reduce((acc, current) => acc + current, 0)
        }

        return cell
    }

    generateCanvasWithMines = (mineCount) => {
        let canvas = createEmptyCanvas(SIZE, { value: 0, visible: false })
        const mineCoord = this.generateRandomCoords(mineCount)

        mineCoord.forEach(coord => {
            canvas[coord.y][coord.x].value = -1
        })

        canvas = canvas.map((column, columnIndex) => {
            return column.map((cell, cellIndex) => this.calculateNumberOfNeighbourMine(canvas, cell, {
                x: cellIndex,
                y: columnIndex
            }))
        })
        return canvas
    }

    generateRandomCoords = (count) => {
        const randomCoords = [];

        do {
            const randomCoord = { x: randomInt(SIZE), y: randomInt(SIZE) };

            if (!randomCoords.find(coord => coord.x === randomCoord.x && coord.y === randomCoord.y)) {
                randomCoords.push(randomCoord)
            }
        } while(randomCoords.length < count)

        return randomCoords
    }

    handleClick = (cell, x, y, e) => {
        if (e.type === 'click') {
            this.onReveal(cell, x, y)
        } else if (e.type === 'contextmenu') {
            this.lockCell(cell)
        }
    }

    onContextMenu = (cell, event) => {
        this.lockCell(cell)
        event.preventDefault()
    }

    lockCell = (cell) => {
        const { canvas } = this.state
        cell.locked = !cell.locked
        this.setState({ canvas })
    }

    onReveal = (cell, x, y) => {
        const { canvas, mineCount } = this.state
        if (cell.locked) return
        if (cell.value === -1) {
            cell.visible = true
            this.setState({ lost: true })
        } else {
            this.reveal(cell, x, y)
            this.verifyWinning(canvas, mineCount)
        }
        this.setState({ canvas })
    }

    reveal = (cell, cellX, cellY) => {
        const { canvas } = this.state

        if (cell.visible) return
        cell.visible = true
        cell.locked = false
        if (cell.value === -1 || cell.value > 0) return

        this.getNeighbourCoord({ x: cellX, y: cellY })
            .forEach(({ x, y }) => this.reveal(canvas[y][x], x, y))
    }

    verifyWinning = (canvas, mineCount) => {
        const revealedCount = canvas.reduce((accu, column) =>
            accu + column.reduce((visiblesCount, cell) => visiblesCount + (cell.visible ? 1 : 0), 0), 0
        )

        const expectedRevealedCount = (SIZE * SIZE) - mineCount

        console.log('verifyWinning', revealedCount, expectedRevealedCount)

        if (revealedCount === expectedRevealedCount) {
            this.setState({ won: true })
        }
    }

    renderCell = (cell, x, y) => {
        return (
            <td key={`cell-${x}`}
                onClick={(e) => this.handleClick(cell, x, y, e)}
                onContextMenu={event => this.onContextMenu(cell, event)}
                className={classNames(`value-${cell.value}`, { visible: cell.visible })}>
                {this.formatCell(cell)}
            </td>)
    }

    formatCell = (cell) => {
        if (cell.locked) return '🚩'
        if (!cell.visible) return
        if (cell.value === 0) return ''
        if (cell.value === -1) return '💣'
        return cell.value
    }

    render() {
        const { canvas, lost, won } = this.state
        return (
            <Canvas
                canvas={canvas}
                renderCell={this.renderCell}
                className={classNames({ lost, won })}
            />
        )
    }
}

export default Minesweeper
