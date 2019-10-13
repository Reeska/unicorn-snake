import {clone} from 'lodash'

export const createEmptyCanvas = (size, defaultValue = -1) => {
    return Array(size)
        .fill(undefined)
        .map(_ =>
            Array(size)
                .fill(undefined)
                .map(_ => clone(defaultValue))
        )
}

