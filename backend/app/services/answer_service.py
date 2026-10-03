from app.ai.chains import generate_report
from app.core.database import execute_sql
from app.schemas.schemas import AnswerResponse


def answer(user_prompt: str, sql_query: str) -> AnswerResponse:
    rows = execute_sql(sql_query)
    result = generate_report(user_prompt, sql_query, rows)
    return AnswerResponse(success=True, report=result.report)
