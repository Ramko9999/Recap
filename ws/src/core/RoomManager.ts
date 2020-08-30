import Room from "./Room";
import { CreateRoomRequest, JoinRoomRequest, ConcludeRoomRequest } from "../interface/Room";

class RoomManager {
    tagMap: Map<String, Set<String>>
    roomMap: Map<String, Room>

    constructor() {
        this.tagMap = new Map<String, Set<String>>();
        this.roomMap = new Map<String, Room>();
    }

    createRoom(data: CreateRoomRequest) {
        const room = new Room(data);
        const roomUid = room.getUid();
        this.roomMap.set(roomUid, room);
        const roomTags = room.getTags();
        for (const tag of roomTags) {
            if (!this.tagMap.has(tag)) {
                this.tagMap.set(tag, new Set([]));
            }
            this.tagMap.get(tag).add(roomUid);
        }
    }

    deleteRoom(roomUid: string) {
        if (this.doesRoomExist(roomUid)) {
            const room = this.roomMap.get(roomUid);
            this.roomMap.delete(roomUid);
            for (const tag of room.getTags()) {
                const roomSet = this.tagMap.get(tag);
                if (roomSet.has(roomUid)) {
                    roomSet.delete(roomUid);
                }
            }
        }
    }

    concludeRoom(data: ConcludeRoomRequest) {
        const { roomUid, endTime } = data;
        if (!this.doesRoomExist(roomUid)) {
            throw Error("Room not found");
        }
        const room = this.roomMap.get(roomUid);
        room.setEndTime(endTime);
        const roomExport = room.serialize();
        this.deleteRoom(roomUid);
        return roomExport;
    }

    joinRoom(data: JoinRoomRequest) {
        const { joiner, isJoinerAnswerer, roomUid } = data;
        if (!this.roomMap.has(roomUid)) {
            throw Error("Room not found");
        }
        const room = this.roomMap.get(roomUid);
        if (!room.getIsOpen()) {
            throw Error("Room is closed");
        }
        if (isJoinerAnswerer) {
            if (room.isThereAnAnswerer()) {
                throw Error("Room is closed. You are trying join an answerer room");
            }
            else {
                room.setAnswerer(joiner);
            }
        }
        else {
            if (room.isThereAQuestioner()) {
                throw Error("Room is closed. You are trying to join a questioner room")
            }
            else {
                room.setQuestioner(joiner);
            }
        }
    }

    searchForRooms(tag: string) {
        if (!this.tagMap.has(tag)) {
            throw Error("Tag not found");
        }
        const roomSet = this.tagMap.get(tag);
        const rooms: Room[] = [];
        roomSet.forEach((roomUid: string) => {
            rooms.push(this.roomMap.get(roomUid));
        });
        return rooms;
    }

    doesRoomExist(roomUid: string) {
        return this.roomMap.has(roomUid);
    }
}

export default RoomManager;