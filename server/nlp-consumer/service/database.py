from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

engine = create_engine(os.environ["PSQL_URI"], echo=True, future=True)
Session = sessionmaker(bind=engine, future=True)
