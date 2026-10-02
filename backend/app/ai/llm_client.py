import json
import re
from typing import Any, Dict, Type, TypeVar

from groq import Groq
from pydantic import BaseModel

from app.core.config import settings

# ============================================================
# GROQ CLIENT
# ============================================================

_client: Groq | None = None


def get_client() -> Groq:
    """
    Return a singleton Groq client.
    """
    global _client

    if _client is None:
        if not settings.GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is not set. Add it to your .env file.")

        _client = Groq(api_key=settings.GROQ_API_KEY)

    return _client


# ============================================================
# TYPES
# ============================================================

T = TypeVar("T", bound=BaseModel)


# ============================================================
# JSON EXTRACTION
# ============================================================


def _extract_json(text: str) -> str:
    """
    Extract a JSON object from an LLM response.

    Handles:
    - Plain JSON
    - ```json ... ```
    - ``` ... ```
    - Extra text before/after the JSON object
    """

    text = text.strip()

    if not text:
        raise ValueError("LLM returned an empty response.")

    # Remove markdown code fences.
    fence_match = re.match(
        r"^```(?:json)?\s*(.*?)\s*```$",
        text,
        re.DOTALL | re.IGNORECASE,
    )

    if fence_match:
        text = fence_match.group(1).strip()

    # Locate the first JSON object.
    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1 and end > start:
        return text[start : end + 1]

    # No JSON object found.
    return text


# ============================================================
# JSON CHAT COMPLETION
# ============================================================


def chat_json(
    system_prompt: str,
    user_prompt: str,
    response_model: Type[T],
    max_completion_tokens: int = 1024,
    temperature: float = 0.0,
) -> T:
    """
    Call Groq Chat Completion and return a validated Pydantic model.

    The request is retried once if:
    - JSON parsing fails
    - The returned JSON does not match the Pydantic schema
    - The LLM returns an invalid response

    Args:
        system_prompt:
            System instructions for the LLM.

        user_prompt:
            User/input content sent to the LLM.

        response_model:
            Pydantic model used to validate the response.

        max_completion_tokens:
            Maximum number of output tokens.

        temperature:
            Sampling temperature.

    Returns:
        A validated instance of `response_model`.

    Raises:
        RuntimeError:
            If the LLM response cannot be parsed/validated after retry.
    """

    client = get_client()

    base_messages = [
        {
            "role": "system",
            "content": system_prompt,
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ]

    last_err: Exception | None = None

    # Maximum 2 attempts.
    for attempt in range(2):
        messages = list(base_messages)

        # On retry, explicitly reinforce the JSON requirement.
        if attempt == 1:
            messages.append(
                {
                    "role": "user",
                    "content": (
                        "Your previous response could not be parsed or "
                        "validated. Return ONLY valid JSON matching the "
                        "required schema. Do not include markdown or "
                        "additional text."
                    ),
                }
            )

        try:
            response = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=temperature,
                response_format={"type": "json_object"},
                max_completion_tokens=max_completion_tokens,
            )

            raw_content = response.choices[0].message.content or ""

            if not raw_content.strip():
                raise ValueError("LLM returned an empty response.")

            json_text = _extract_json(raw_content)

            payload: Dict[str, Any] = json.loads(json_text)

            # Pydantic v2.
            return response_model.model_validate(payload)

        except Exception as exc:
            last_err = exc

    raise RuntimeError(f"LLM JSON parse/validation failed after 2 attempts: {last_err}")
