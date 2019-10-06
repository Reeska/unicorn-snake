import React from 'react'
import {DOWN, LEFT, RIGHT, UP} from "../Constants"

import './Cell.scss'

export class Cell extends React.Component {
    constructor(props) {
        super(props)
    }

    drawCell = (cell) => {
        if(cell === 0) return this.props.emote
        if(cell === 1) return '🦄'
        if(cell > 1) return '💖'
        return ''
    }

    cellClasses = (cell, direction) => {
        if (cell >= 1) {
            if (direction === LEFT) return 'left'
            if (direction === RIGHT) return 'right'
            if (direction === UP) return 'up'
            if (direction === DOWN) return 'down'
        }
        return ''
    }

    render() {
        const { cell, direction } = this.props

        return (
            <td className={this.cellClasses(cell, direction)}>
                {this.drawCell(cell)}
            </td>
        )
    }
}
