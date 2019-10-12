export const createEmptyCanvas = (size) => {
        return Array(size)
            .fill(undefined)
            .map(_ => Array(size).fill(-1))
    }
