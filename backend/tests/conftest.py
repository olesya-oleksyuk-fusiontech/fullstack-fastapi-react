from typing import Dict

import pytest
import sqlalchemy as sa
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

import crud
from config import DB_USER, DB_PASS, DB_HOST, DB_PORT, TEST_DB_NAME
from core.config import settings
from database import Base, get_db
from main import app
from schemas.user import User
from tests.utils.user import authentication_token_from_email
from tests.utils.utils import get_superuser_token_headers

TEST_DATABASE_URL = f'mysql+mysqlconnector://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{TEST_DB_NAME}'

engine = create_engine(
    TEST_DATABASE_URL
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set up the database once
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


# This fixture creates a nested transaction,
# recreates it when the application code calls session.commit
# and rolls it back at the end.
# Based on: https://docs.sqlalchemy.org/en/14/orm/session_transaction.html#joining-a-session-into-an-external-transaction-such-as-for-test-suites
@pytest.fixture(scope="module")
def session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Begin a nested transaction (using SAVEPOINT).
    nested = connection.begin_nested()

    # If the application code calls session.commit, it will end the nested
    # transaction. Need to start a new one when that happens.
    @sa.event.listens_for(session, "after_transaction_end")
    def end_savepoint(session, transaction):
        nonlocal nested
        if not nested.is_active:
            nested = connection.begin_nested()

    yield session

    # Rollback the overall transaction, restoring the state before the test ran.
    session.close()
    transaction.rollback()
    connection.close()


# A fixture for the fastapi test client which depends on the previous session fixture.
# Instead of creating a new session in the dependency override as before,
# it uses the one provided by the session fixture.
@pytest.fixture(scope="module")
def client(session):
    def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
def normal_user_token_headers(client: TestClient, session: Session) -> Dict[str, str]:
    return authentication_token_from_email(
        client=client,
        email=settings.EMAIL_TEST_USER,
        password=settings.EMAIL_TEST_PASSWORD, session=session
    )


@pytest.fixture(scope="module")
def get_superuser(session: Session) -> User:
    try:
        return crud.get_user_by_email(db=session, email=settings.FIRST_SUPERUSER_EMAIL)
    except Exception as e:
        if e.status_code == 404:
            assert False, 'No superuser is found in DB. Inject superuser_token_headers first'
