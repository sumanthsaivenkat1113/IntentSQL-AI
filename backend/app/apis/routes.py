from fastapi import APIRouter, HTTPException

from app.schemas.schemas import (
    UserPromptRequest,
    AnswerRequest,
    AmbiguityResponse,
    ClarificationResponse,
    SQLGenerationResponse,
    AnswerResponse,
)
from app.services import (
    ambiguity_service,
    clarification_service,
    sql_service,
    answer_service,
)

router = APIRouter(prefix="/api", tags=["IntentSQL"])


# ------------------ 1) Ambiguity API ------------------
@router.post("/is-ambiguous", response_model=AmbiguityResponse)
def is_ambiguous(body: UserPromptRequest):
    try:
        return ambiguity_service.check_ambiguity(body.user_prompt)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))


# ------------------ 2) Clarification API ------------------
@router.post("/clarify", response_model=ClarificationResponse)
def clarify(body: UserPromptRequest):
    try:
        return clarification_service.clarify(body.user_prompt)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))


# ------------------ 3) SQL Generation API ------------------
@router.post("/generate-sql", response_model=SQLGenerationResponse)
def generate_sql(body: UserPromptRequest):
    try:
        return sql_service.build_sql(body.user_prompt)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))


# ------------------ 4) Answer API ------------------
@router.post("/answer", response_model=AnswerResponse)
def answer(body: AnswerRequest):
    try:
        return answer_service.answer(body.user_prompt, body.SQL_Query)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))
