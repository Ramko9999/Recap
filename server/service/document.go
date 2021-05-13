package services

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Document struct {
	ID        	string `gorm:"primaryKey;type:varchar(50)" json:"id"`
	CreatedAt 	time.Time `json:"createdAt"`
	UpdatedAt 	time.Time
	DeletedAt 	gorm.DeletedAt `gorm:"index"`
	Name 	  	string `gorm:"type:text" json:"name"`
	PreviewUrl	string `gorm:"type:text" json:"previewUrl"`
	BlobUrl 	string `gorm:"type:text" json:"blobUrl"`
	Size 		int `gorm:"type:int" json:"size"`
	State 		string `gorm:"type:varchar(25)" json:"state"`
	JobError 	string `gorm:"type:text" json:"jobError"`
	UserID		string `json:"userId"`
}

type DocumentCreation struct {
	UserID 		string `json:"userId" binding:"required"`
	Name   		string `json:"name" binding:"required"`
	PreviewUrl 	string `json:"previewUrl" binding:"required"`
	BlobUrl 	string `json:"blobUrl" binding:"required"`
	Size 		int    `json:"size" binding:"required"`
}

const (
	QUEUED = "QUEUED"
)

func GetDocuments(userId string) (*[]Document, error) {
	var documents []Document 

	result := DB.Where("user_id = ?", userId).Find(&documents)
	if result.Error != nil {
		return nil, result.Error
	}
	return &documents, nil
}

func CreateDocument(creation DocumentCreation) (*Document, error) {
	documentId := uuid.New().String()
	document := &Document{
		ID: documentId,
		Name: creation.Name,
		PreviewUrl: creation.PreviewUrl,
		BlobUrl: creation.BlobUrl,
		Size: creation.Size,
		State: QUEUED,
		JobError: "",
		UserID: creation.UserID,
	}
	if result := DB.Create(document); result.Error != nil {
		return nil, result.Error
	} else {
		// add to document to message queue
		return document, nil
	}
}

func DeleteDocument(documentId string) error {
	if result := DB.Where("id = ?", documentId).Delete(&Document{}); result.Error != nil {
		return result.Error
	}
	return nil
}
