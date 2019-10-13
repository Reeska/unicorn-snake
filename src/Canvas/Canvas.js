import React from 'react'

const Canvas = ({ canvas, renderCell, reference, onKeyDown, className }) => {
    if (!canvas) return null
    return (
        <div tabIndex='0' ref={reference} onKeyDown={onKeyDown}>
            <table className={className}>
                <tbody>
                {canvas.map((column, columnIndex) => (
                    <tr key={`column-${columnIndex}`}>
                        {column.map((cell, cellIndex) => renderCell(cell, cellIndex, columnIndex))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Canvas
