import {makeTaggedUnion, none} from "safety-match"

export const Result = makeTaggedUnion({
    Success: (contents: any) => contents,
    Error: (message: string) => message
})
