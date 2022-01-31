package services

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"encoding/json"
)

type Document struct {
	ID        	string `gorm:"primaryKey;type:varchar(50)" json:"id"`
	CreatedAt 	time.Time `json:"createdAt"`
	UpdatedAt 	time.Time
	DeletedAt 	gorm.DeletedAt `gorm:"index"`
	Name 	  	string `gorm:"type:text" json:"name"`
	PreviewUrl	string `gorm:"type:text" json:"previewUrl"`
	DocumentUrl string `gorm:"type:text" json:"documentUrl"`
	PreviewBlobId string `gorm:"type:text" json:"previewBlobId"`
	DocumentBlobId string `gorm:"type:text" json:"documentBlobId"`
	Size 		int `gorm:"type:int" json:"size"`
	State 		string `gorm:"type:varchar(25)" json:"state"`
	JobError 	string `gorm:"type:text" json:"jobError"`
	UserID		string `json:"userId"`
}

type DocumentCreation struct {
	UserId 		string `json:"userId" binding:"required"`
	Name   		string `json:"name" binding:"required"`
	PreviewUrl 	string `json:"previewUrl" binding:"required"`
	DocumentUrl string `json:"documentUrl" binding:"required"`
	PreviewBlobId string `json:"previewBlobId" binding:"required"`
	DocumentBlobId string `json:"documentBlobId" binding:"required"`
	Size 		int    `json:"size" binding:"required"`
}

type DocumentJob struct {
	UserId string `json:"userId"`
	DocumentId string `json:"documentId"`
}

const (
	QUEUED = "QUEUED"
)

func GetDocuments(userId string) (*[]Document, error) {
	var documents []Document 
	result := PSQL.DB.Where("user_id = ?", userId).Find(&documents).Order("created_at DESC")
	if result.Error != nil { return nil, result.Error }
	return &documents, nil
}

func CreateDocument(creation DocumentCreation) (*Document, error) {
	documentId := uuid.New().String()
	document := &Document{
		ID: documentId,
		Name: creation.Name,
		PreviewUrl: creation.PreviewUrl,
		DocumentUrl: creation.DocumentUrl,
		PreviewBlobId: creation.PreviewBlobId,
		DocumentBlobId: creation.DocumentBlobId,
		Size: creation.Size,
		State: QUEUED,
		JobError: "",
		UserID: creation.UserId,
	}
	
	if result := PSQL.DB.Create(document); result.Error != nil {
		return nil, result.Error
	} 

	return document, nil
}

func PutDocumentInQueue(job *DocumentJob) error {
	if marshal, err := json.Marshal(job); err != nil {
		return err
	} else {
		return MQ.Push(marshal)
	}
}

func DeleteDocument(documentId string) error {
	return PSQL.DB.Where("id = ?", documentId).Delete(&Document{}).Error
}
