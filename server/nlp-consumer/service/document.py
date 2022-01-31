from sqlalchemy.orm import declarative_base, se
from sqlalchemy import Column, Integer, String, DateTime, select
from .database import Session

Base = declarative_base()

class DownloadError(Exception):
    pass

class DocumentNotFoundError(Exception):
    pass

class ParseError(Exception):
    pass

class AckError(Exception):
    pass

class MessageFormatError(Exception):
    pass

class Document(Base):

    __tablename__ = "documents"

    id = Column(String, primary_key=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime) 
    deleted_at = Column(DateTime, index=True)
    name = Column(String)
    preview_url = Column(String)
    document_url = Column(String)
    preview_blob_id = Column(String)
    document_blob_id = Column(String)
    size = Column(Integer)
    state = Column(String)
    job_error = Column(String)
    user_id = Column(String)

    def __repr__(self):
        return f"<Document: {self.id}, {self.user_id}, {self.state}, {self.size}"

class DocumentJob:
    __slots__ = ("document_id", "document")
    def __init__(self, document_id):
        self.document_id = document_id
        self.document = None
        self.get_document()
    
    def get_document(self):
        with Session() as session:
            stmt = select(Document).where(Document.user_id == self.document_id)
            for document in session.execute(stmt):
                self.document = document
        if not self.document:
            raise DocumentNotFoundError()
        
