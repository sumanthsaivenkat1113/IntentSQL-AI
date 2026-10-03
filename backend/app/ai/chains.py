"""
Thin wrapper exposing the four LLM chains used by the services.

Each function has a single responsibility and returns
a validated Pydantic model.
"""

from app.ai.llm_client import chat_json

from app.ai.prompts import (
    AMBIGUITY_SYSTEM_PROMPT,
    CLARIFICATION_SYSTEM_PROMPT,
    SQL_SYSTEM_PROMPT,
    ANSWER_SYSTEM_PROMPT,
)

from app.schemas.schemas import (
    LLMAmbiguity,
    LLMClarification,
    LLMSQL,
    LLMReport,
)

# ============================================================
# AMBIGUITY DETECTION
# ============================================================


def detect_ambiguity(user_prompt: str) -> LLMAmbiguity:
    return chat_json(
        system_prompt=AMBIGUITY_SYSTEM_PROMPT,
        user_prompt=f"User question: {user_prompt}",
        response_model=LLMAmbiguity,
        max_completion_tokens=256,
        temperature=0.0,
    )


# ============================================================
# CLARIFICATION
# ============================================================


def generate_clarification(user_prompt: str) -> LLMClarification:
    return chat_json(
        system_prompt=CLARIFICATION_SYSTEM_PROMPT,
        user_prompt=f"Ambiguous user question: {user_prompt}",
        response_model=LLMClarification,
        max_completion_tokens=256,
        temperature=0.2,
    )


# ============================================================
# SQL GENERATION
# ============================================================


def generate_sql(user_prompt: str) -> LLMSQL:
    return chat_json(
        system_prompt=SQL_SYSTEM_PROMPT,
        user_prompt=f"User question: {user_prompt}",
        response_model=LLMSQL,
        max_completion_tokens=800,
        temperature=0.0,
    )


# ============================================================
# REPORT GENERATION
# ============================================================


def generate_report(
    user_prompt: str,
    sql_query: str,
    rows: list[dict],
) -> LLMReport:

    payload = (
        f"User question:\n{user_prompt}\n\n"
        f"Executed SQL:\n{sql_query}\n\n"
        f"Returned rows (JSON):\n{rows}"
    )

    return chat_json(
        system_prompt=ANSWER_SYSTEM_PROMPT,
        user_prompt=payload,
        response_model=LLMReport,
        max_completion_tokens=400,
        temperature=0.2,
    )
