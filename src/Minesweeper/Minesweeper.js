import React from 'react';
import { createEmptyCanvas } from '../Canvas/utils'
import Canvas from '../Canvas/Canvas'

const SIZE = 20

class Minesweeper extends React.Component {
    constructor(props) {
        super(props)
        this.state = { canvas: createEmptyCanvas(SIZE) }
    }

    renderCell = (cell, index) => <td>X</td>

    render() {
        const { canvas } = this.state
        return (
            <Canvas
                canvas={canvas}
                renderCell={this.renderCell}
            />
        )
    }
}

export default Minesweeper
