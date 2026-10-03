from app.ai.chains import generate_sql
from app.schemas.schemas import SQLGenerationResponse


def build_sql(user_prompt: str) -> SQLGenerationResponse:
    result = generate_sql(user_prompt)
    sql = result.SQL.strip()

    # Basic safety: read-only enforcement
    lowered = sql.lower()
    if not lowered.lstrip().startswith(("select", "with")):
        raise ValueError("Generated SQL is not a read-only SELECT/CTE query.")
    forbidden = (
        "insert ",
        "update ",
        "delete ",
        "drop ",
        "alter ",
        "truncate ",
        "create ",
    )
    if any(token in lowered for token in forbidden):
        raise ValueError("Generated SQL contains a forbidden write operation.")

    return SQLGenerationResponse(success=True, SQL_Query=sql)
