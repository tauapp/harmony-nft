import {makeTaggedUnion, none} from "safety-match"

export const Result = makeTaggedUnion({
    Success: none,
    Error: (message: string) => message
})
