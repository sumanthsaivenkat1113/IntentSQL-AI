from app.ai.chains import generate_clarification
from app.schemas.schemas import ClarificationResponse


def clarify(user_prompt: str) -> ClarificationResponse:
    result = generate_clarification(user_prompt)
    return ClarificationResponse(success=True, Clarification=result.Clarification)
