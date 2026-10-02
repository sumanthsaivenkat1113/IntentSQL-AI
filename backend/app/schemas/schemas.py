from pydantic import BaseModel, Field


# ---------- Request Bodies ----------
class UserPromptRequest(BaseModel):
    user_prompt: str = Field(
        ..., min_length=1, description="Natural-language user question"
    )


class AnswerRequest(BaseModel):
    user_prompt: str = Field(..., min_length=1)
    SQL_Query: str = Field(..., min_length=1)


# ---------- API Responses ----------
class AmbiguityResponse(BaseModel):
    success: bool = True
    is_ambiguous: bool


class ClarificationResponse(BaseModel):
    success: bool = True
    Clarification: str


class SQLGenerationResponse(BaseModel):
    success: bool = True
    SQL_Query: str


class AnswerResponse(BaseModel):
    success: bool = True
    report: str


# ---------- Internal LLM Shapes (not exposed) ----------
class LLMAmbiguity(BaseModel):
    is_ambiguous: bool


class LLMClarification(BaseModel):
    Clarification: str


class LLMSQL(BaseModel):
    SQL: str


class LLMReport(BaseModel):
    report: str
