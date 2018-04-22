# coding: utf-8
from __future__ import absolute_import

from contextlib import contextmanager

from sqlalchemy import Column
from sqlalchemy import create_engine
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from . import config


DeclarativeBase = declarative_base()


class Comment(DeclarativeBase):
    __tablename__ = 'comment'
    post_id = Column(BIGINT(unsigned=True), primary_key=True,
                     index=True, autoincrement=False)
    comment_id = Column(BIGINT(unsigned=True), primary_key=True,
                        index=True, autoincrement=False)
    replyto_comment_id = Column(BIGINT(unsigned=True), nullable=False)
    create_time = Column(DATETIME(), nullable=False, index=True)
    commenter_name = Column(VARCHAR(100), nullable=False)
    comment_content = Column(VARCHAR(15000), nullable=False)
    is_admin = Column(TINYINT(unsigned=True), nullable=False)
    is_viewed = Column(TINYINT(unsigned=True), nullable=False)
    is_blocked = Column(TINYINT(unsigned=True), nullable=False)


class CommentMaxID(DeclarativeBase):
    __tablename__ = 'commentmaxid'
    post_id = Column(BIGINT(unsigned=True), primary_key=True,
                     autoincrement=False)
    comment_id = Column(BIGINT(unsigned=True), nullable=False)


def get_engine_uri():
    driver = config.DATABASE_DRIVER

    host = config.DATABASE_HOST

    port = config.DATABASE_PORT

    user = config.DATABASE_USERNAME

    passwd = config.DATABASE_PASSWORD

    dbname = config.DATABASE_NAME

    engine_uri = '{driver}://{user}{passwd}@{server}{dbname}'.format(
        driver=driver,
        user=user,
        passwd=':{}'.format(passwd) if passwd is not None else '',
        server='{}:{}'.format(host, port) if port is not None else host,
        dbname='/{}'.format(dbname) if dbname else '',
    )

    return engine_uri


def create_all_tables():
    engine = create_engine(get_engine_uri())

    DeclarativeBase.metadata.create_all(engine)


ENGINE = create_engine(get_engine_uri())

SESSION_MAKER = sessionmaker(
    bind=ENGINE,
    expire_on_commit=False,
)


@contextmanager
def session_context():
    try:
        session = SESSION_MAKER()
        yield session
    finally:
        session.close()
