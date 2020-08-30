import Question from "./Question"
import Message from "./message"
import { CreateRoomRequest } from "../interface/Room"
import {v4 as uuidv4} from "uuid"
import { CreateMessageRequest } from "../interface/Message"
import { CreateQuestionRequest, EditAnswerRequest, EditNotesRequest, EditPointsRequest} from "../interface/Question"

class Room {
    
    uid: string
    answerer:string | null
    questioner: string | null
    questions: Question[]
    questionMap: Map<String, Question>
    startTime: string
    endTime: string | null
    messages: Message[]
    tags: string[]

    constructor(data: CreateRoomRequest){
        const {creator, isCreatorAnswerer, startTime, tags} = data;
        this.uid = "RM-" + uuidv4();
        this.questions = [];
        this.questionMap = new Map<String, Question>();
        this.startTime = startTime;
        this.endTime = null;
        this.messages = [];
        this.tags = tags;
        if(isCreatorAnswerer){
            this.answerer = creator;
        }
        else{
            this.questioner = creator;
        }
    }

    getUid(){
        return this.uid;
    }

    getTags(){
        return this.tags;
    }

    getIsOpen(){
        return this.isThereAQuestioner() || this.isThereAnAnswerer();
    }

    getQuestionLog(){
        return JSON.stringify(this.questions);
    }

    getMessageLog(){
        return JSON.stringify(this.messages);
    }

    isThereAQuestioner(){
        return this.questioner === null;
    }

    isThereAnAnswerer(){
        return this.answerer === null;
    }

    setAnswerer(answerer: string){
        this.answerer = answerer;
    }

    setQuestioner(questioner: string){
        this.questioner = questioner;
    }

    setEndTime(endTime: string){
        this.endTime = endTime;
    }

    addQuestion(data: CreateQuestionRequest){
        const question = new Question(data);
        this.questions.push(question);
        this.questionMap.set(question.getUid(), question);
    }

    answerQuestion(data: EditAnswerRequest){
        const {questionUid} = data;
        this.questionMap.get(questionUid).setAnswer(data);
    }

    writeNotesOnQuestion(data: EditNotesRequest){
        const {questionUid, notes} = data;
        this.questionMap.get(questionUid).setNotes(notes);
    }

    givePointsToQuestion(data: EditPointsRequest){
        const {questionUid, points} = data;
        this.questionMap.get(questionUid).setPoints(points);
    }

    addMessage(data: CreateMessageRequest){
        const message = new Message(data);
        this.messages.push(message);
    }

    serialize(){
        return JSON.stringify(this);
    }
}

export default Room;