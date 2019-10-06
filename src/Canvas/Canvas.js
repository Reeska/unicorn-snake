import React from 'react';
import cloneDeep from 'lodash/cloneDeep'
import './Canvas.scss';

import {BONUS_EMOTES, DOWN, keyPadDirectionMapping, LEFT, RIGHT, UP} from '../Constants'
import {randomInt} from "../utils";
import {Cell} from "../Cell/Cell";

const SIZE = 20

class Canvas extends React.Component {
    constructor(props) {
        super(props)

        this.canvasRef = React.createRef()

        const canvas = this.createEmptyCanvas()
        const position = { x: SIZE / 2, y: (SIZE / 2) - 1 }
        canvas[position.y][position.x] = 1
        const emote = this.addCherry(canvas)

        this.state = { position, canvas, direction: RIGHT, emote }
    }

    componentDidMount() {
        this.canvasRef.current.focus()
        this.start();
    }

    start = () => {
        const idOfInterval = setInterval(() => {
            this.moveSnake()
        }, 120);

        this.setState({ idOfInterval })
    }

    stop = () => {
        const { idOfInterval } = this.state;

        clearInterval(idOfInterval)

        this.setState({ idOfInterval: -1 })
    }

    pause = () => {
        const { idOfInterval } = this.state;
        const paused = idOfInterval === -1;

        if (paused) {
            this.start()
        } else {
            this.stop()
        }

        this.setState({
            paused: !paused
        })
    }

    addCherry = (canvas) => {
        let randomY, randomX
        do {
            randomY = randomInt(SIZE - 1)
            randomX = randomInt(SIZE - 1)
        } while (canvas[randomY][randomX] >= 0)

        canvas[randomY][randomX] = 0

        return this.randomEmote();
    }

    createEmptyCanvas = () => {
        return Array(SIZE)
            .fill(undefined)
            .map(_ => Array(SIZE).fill(-1))
    }

    onKeyDown = (keyEvent) => {
        if (keyPadDirectionMapping[keyEvent.key] !== undefined) {
            return this.changeDirection(keyEvent)
        }

        if (keyEvent.keyCode === 32) {
            return this.pause()
        }
    }

    changeDirection = (keyEvent) => {
        const { direction } = this.state
        const newDirection = keyPadDirectionMapping[keyEvent.key]
        const oppositeDirection = { x: direction.x * -1, y: direction.y * -1 }
        if (newDirection.x === oppositeDirection.x && newDirection.y === oppositeDirection.y) {
            return
        }
        this.setState({ direction: newDirection })
    }

    isOutOfBounds = (position) =>
        position.x >= SIZE || position.y >= SIZE || position.x < 0 || position.y < 0

    moveSnake = () => {
        const { position, direction, idOfInterval, canvas } = this.state
        const futurePosition = {
            x: position.x + direction.x,
            y: position.y + direction.y
        }

        if (this.isOutOfBounds(futurePosition) || canvas[futurePosition.y][futurePosition.x] > 0) {
            this.stop()
            this.setState({ lost: true })
            return
        }

        this.setState({ position: futurePosition }, this.drawSnake)
    }

    drawSnake = () => {
        const { position, canvas } = this.state

        let newCanvas = cloneDeep(canvas)
        let maxValue = -1
        let maxValueCoord = { x: 0, y: 0 }

        newCanvas = newCanvas.map((column, y) => column.map((cell, x) => {
            if (cell > maxValue) {
                maxValue = cell
                maxValueCoord = { y, x }
            }
            if (cell >= 1) return cell + 1
            return cell
        }))

        if (newCanvas[position.y][position.x] === 0) {
            this.setState({
                emote: this.addCherry(newCanvas)
            })
        } else {
            newCanvas[maxValueCoord.y][maxValueCoord.x] = -1
        }

        newCanvas[position.y][position.x] = 1

        this.setState({
            canvas: newCanvas,
        })
    }

    randomEmote = () => {
        return BONUS_EMOTES[randomInt(BONUS_EMOTES.length - 1)]
    }

    render() {
        const { canvas, lost, direction, emote, paused } = this.state
        return (
            <div tabIndex='0' ref={this.canvasRef} onKeyDown={this.onKeyDown}>
                <table className={(lost ? 'lost' : '') + ' ' + (paused ? 'paused' : '' )}>
                    <tbody>
                    {canvas.map((column, columnIndex) => (
                        <tr key={`column-${columnIndex}`}>
                            {column.map((cell, cellIndex) => {
                                return (
                                    <Cell key={`row-${cellIndex}`} cell={cell} direction={direction} emote={emote}/>
                                )
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Canvas
