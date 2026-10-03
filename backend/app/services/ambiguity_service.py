from app.ai.chains import detect_ambiguity
from app.schemas.schemas import AmbiguityResponse


def check_ambiguity(user_prompt: str) -> AmbiguityResponse:
    result = detect_ambiguity(user_prompt)
    return AmbiguityResponse(success=True, is_ambiguous=result.is_ambiguous)
