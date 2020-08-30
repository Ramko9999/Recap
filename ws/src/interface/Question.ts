export interface CreateQuestionRequest{
    content: string,
    createdTime: string
}

export interface EditAnswerRequest {
    questionUid: string
    answer: string,
    answeredTime: string
}

export interface EditNotesRequest{
    questionUid: string,
    notes: string
}

export interface EditPointsRequest{
    questionUid: string,
    points: number,
}