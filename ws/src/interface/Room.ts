export interface CreateRoomRequest{
    creator: string,
    tags: string[],
    startTime: string,
    isCreatorAnswerer: boolean
}

export interface JoinRoomRequest{
    joiner: string,
    roomUid: string,
    isJoinerAnswerer: boolean
}

export interface ConcludeRoomRequest{
    roomUid: string,
    endTime: string
}