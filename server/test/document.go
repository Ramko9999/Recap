package tests

import (
	"recap-server/service"
	"testing"
	"sort"
)


const DOCUMENT_CREATOR = "Document Creator's Id"


func isCreationEqualToDocument (creation services.DocumentCreation, document services.Document) bool {
	return (creation.Name == document.Name && creation.UserID == document.UserID && creation.Size == document.Size && creation.PreviewUrl == document.PreviewUrl && creation.BlobUrl == document.BlobUrl)
}

func TestCreatingDocuments(t *testing.T){

	documentCreations := []services.DocumentCreation{
		{
			UserID: DOCUMENT_CREATOR,
			Name: "History Book",
			PreviewUrl: "http://localhost:9090/preview/history-book",
			BlobUrl: "http://localhost:9090/blob/history-book",
			Size: 9891,
		},
		{
			UserID: DOCUMENT_CREATOR,
			Name: "Science Book",
			PreviewUrl: "http://localhost:9090/preview/science-book",
			BlobUrl: "http://localhost:9090/blob/science-book",
			Size: 17291,
		},
		{
			UserID: DOCUMENT_CREATOR,
			Name: "Math Book",
			PreviewUrl: "http://localhost:9090/preview/math-book",
			BlobUrl: "http://localhost:9090/blob/math-book",
			Size: 1421,
		},
	}

	for _, documentCreation := range(documentCreations) {
		if _, err := services.CreateDocument(documentCreation); err != nil {
			t.Errorf("Unexpected error when creating document %s %s", documentCreation.UserID, err.Error())
		}
	}

	if retrievedDocuments, err := services.GetDocuments(DOCUMENT_CREATOR); err != nil {
		t.Errorf("Unexpected error when getting documents %s", err.Error())
	} else {
		if len(*retrievedDocuments) != len(documentCreations) {
			t.Errorf("The length of the actual %v and expected %v don't match", len(*retrievedDocuments), len(documentCreations))
		}
		sort.Slice(documentCreations, func(i, j int) bool {
			return documentCreations[i].Size < documentCreations[j].Size
		})

		sort.Slice(*retrievedDocuments, func(i, j int) bool {
			return (*retrievedDocuments)[i].Size < (*retrievedDocuments)[j].Size
		})

		for i := range(documentCreations) {
			if !isCreationEqualToDocument(documentCreations[i], (*retrievedDocuments)[i]){
				t.Errorf("document %s is not equal", documentCreations[i].Name)
			}
		}
	}
}

func TestDeletingDocuments(t *testing.T) {
	retrievedDocuments, err := services.GetDocuments(DOCUMENT_CREATOR)
	if err != nil {
		t.Errorf("Unexpected error when getting documents %s", err.Error())
	}

	for i := range(*retrievedDocuments) {
		docId := (*retrievedDocuments)[i].ID
		if err := services.DeleteDocument(docId); err != nil {
			t.Errorf("Unexpected error when deleting document %s", docId)
		} else {
			if newDocs, err := services.GetDocuments(DOCUMENT_CREATOR); err != nil {
				t.Errorf("Unexpected error when getting documents %s", err.Error())
			} else {
				if len(*newDocs) != 2-i{
					t.Errorf("Actual length of docs %v is not equal to expected %v", len(*newDocs), 2-i)
				}
			}
		}
	}
}