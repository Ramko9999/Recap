import { CreateMessageRequest } from "../interface/Message"
import {v4 as uuidv4} from "uuid"

class Message {
    uid:string
	authorUid:string
	sentTime: string
	content: string
    hasEdited: boolean
    
    
    constructor(data: CreateMessageRequest){
        const {authorUid, sentTime, content} = data;
        this.uid = "ME-" + uuidv4();
        this.authorUid = authorUid;
        this.sentTime = sentTime;
        this.content = content;
        this.hasEdited = false;
    }

    editMessage(content: string){
        this.content = content;
        this.hasEdited = true;
    }
}

export default Message;