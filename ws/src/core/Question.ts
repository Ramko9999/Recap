import { CreateQuestionRequest, EditAnswerRequest } from "../interface/Question"
import {v4 as uuidv4} from "uuid";

class Question{

    uid: string
    content:string
    createdTime: string
    answeredTime: string | null
    answer: string | null;
    notes: string
    points: Number | null;

    constructor(data: CreateQuestionRequest){
        const {content, createdTime} = data;
        this.uid = "QU-" + uuidv4();
        this.content = content;
        this.answer = null;
        this.notes = "";
        this.points = null;
        this.createdTime = createdTime;
    }

    getUid(){
        return this.uid;
    }

    getPoints(){
        return this.points;
    }

    hasAnswered(){
        return this.answer !== null;
    }

    hasGivenPoints(){
        return this.points !== null;
    }

    setAnswer(data: EditAnswerRequest){
        const {answer, answeredTime} = data;
        this.answer = answer;
        this.answeredTime = answeredTime;
    }

    setPoints(points: number){
        this.points = points;
    }

    setNotes(notes: string){
        this.notes = notes;
    }
}

export default Question;