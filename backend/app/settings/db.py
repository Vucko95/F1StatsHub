from sqlalchemy import  create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from settings.config import *
from sqlalchemy.orm import sessionmaker
from fastapi import Depends, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session


engine = create_engine(DB_URL)
DatabaseSession   = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()



def get_database_session():
    db = DatabaseSession()
    try:
        yield db
    finally:
        db.close()