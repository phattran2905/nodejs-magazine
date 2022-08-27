
import { customAlphabet } from "nanoid"


export function randomId(size = 6) {
    console.log(1)
    const nanoid = customAlphabet('1234567890abcdef', 10)
    const id = nanoid(size)
    console.log(nanoid)
    return id
}