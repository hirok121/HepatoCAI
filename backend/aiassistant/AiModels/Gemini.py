import os
from typing import Dict, Any, Optional, List
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()


class GeminiAIAssistant:
    """Simplified AI Assistant for Django views."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.model_name = "gemini-1.5-flash"

        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")

        genai.configure(api_key=self.api_key)

        # System prompt for HepatoCAI medical assistant
        self.system_prompt = """You are HepatoCAI Assistant, a specialized AI medical companion for the HepatoCAI platform, focused on Hepatitis C (HCV) education and support.

CORE IDENTITY & PURPOSE:
- You are a knowledgeable, empathetic medical AI assistant specializing in Hepatitis C
- Your primary role is to provide accurate, evidence-based information about HCV
- You operate within the HepatoCAI platform, which offers AI-powered HCV stage detection and comprehensive hepatitis care
- You have access to comprehensive HCV resource documentation to provide accurate, up-to-date information

KNOWLEDGE AREAS:
- Hepatitis C virus transmission, symptoms, and prevention
- HCV fibrosis stages (F0-F4) and disease progression
- Laboratory values interpretation (ALP, AST, CHE, CREA, GGT)
- Treatment options including DAA (Direct-Acting Antiviral) therapies
- Lifestyle modifications and supportive care strategies
- Latest hepatology research and clinical guidelines

CAPABILITIES:
- Explain HCV diagnosis results and staging (Class 0-3: Blood Donors, Hepatitis, Fibrosis, Cirrhosis)
- Provide educational content about liver health and hepatitis prevention
- Guide users on when to seek professional medical care
- Explain laboratory test results in patient-friendly language
- Offer support and information for patients and healthcare providers
- Reference comprehensive HCV resource materials for accurate information

COMMUNICATION STYLE:
- Compassionate, professional, and evidence-based
- Use clear, accessible language while maintaining medical accuracy
- Acknowledge the emotional aspects of HCV diagnosis and treatment
- Provide hope and encouragement while being realistic about health conditions

SAFETY PROTOCOLS:
- Always emphasize that AI guidance is for educational purposes only
- Strongly recommend professional medical consultation for diagnosis and treatment decisions
- Never provide specific medical advice, dosages, or treatment recommendations
- Refer users to healthcare providers for personalized medical care
- Acknowledge limitations and direct to appropriate medical professionals when needed

PLATFORM CONTEXT:
- HepatoCAI offers AI-powered HCV stage detection with 96.73% accuracy
- The platform provides comprehensive diagnosis management and analytics
- Users may be patients, healthcare providers, or individuals seeking HCV information
- Integration with diagnosis tools and patient data management systems

Remember: You are a supportive educational resource, not a replacement for professional medical care. Always prioritize patient safety and encourage appropriate medical consultation."""  # Initialize the model
        self.model = genai.GenerativeModel(
            self.model_name, system_instruction=self.system_prompt
        )
        # Load HCV resource PDF if available
        self.hcv_resource_file = None
        self._load_hcv_resource()

    def _load_hcv_resource(self):
        """Load the HCV resource PDF file for enhanced AI responses."""
        try:
            # Get the path to the PDF file
            current_dir = Path(__file__).parent
            pdf_path = current_dir / "hcv_resource.pdf"

            if pdf_path.exists():
                # Upload the file to Gemini
                self.hcv_resource_file = genai.upload_file(str(pdf_path))
                print(
                    f"✅ HCV resource PDF loaded successfully: {self.hcv_resource_file.name}"
                )
            else:
                print(f"⚠️ HCV resource PDF not found at: {pdf_path}")
        except Exception as e:
            print(f"❌ Error loading HCV resource PDF: {e}")
            self.hcv_resource_file = None

    def get_response(
        self, prompt: str, chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Get AI response with optional chat history and HCV resource context.

        Args:
            prompt (str): User message
            chat_history (list): Previous messages [{"role": "user/assistant", "content": "..."}]

        Returns:
            dict: {"success": bool, "response": str, "error": str}
        """
        try:
            # Prepare the content for the request
            content_parts = [
                prompt
            ]  # Add HCV resource PDF if available for enhanced context
            if self.hcv_resource_file:
                content_parts.append(self.hcv_resource_file)
                # Add instruction to reference the PDF when relevant
                enhanced_prompt = f"""You have access to an HCV resource document. Only reference this document if the user's question is specifically related to Hepatitis C, liver disease, or medical topics that would benefit from the clinical information in the resource. For general questions or topics unrelated to HCV/liver health, respond normally without referencing the document.

User question: {prompt}

Please provide a helpful response. If this question relates to Hepatitis C or liver health, you may use information from the HCV resource document to enhance your answer."""
                content_parts = [enhanced_prompt, self.hcv_resource_file]

            if chat_history:
                # Format history for Gemini API
                formatted_history = []
                for msg in chat_history:
                    role = "model" if msg["role"] == "assistant" else msg["role"]
                    formatted_history.append({"role": role, "parts": [msg["content"]]})
                    chat = self.model.start_chat(history=formatted_history)
                if self.hcv_resource_file:
                    response = chat.send_message(content_parts)
                else:
                    response = chat.send_message(prompt)
            else:
                if self.hcv_resource_file:
                    response = self.model.generate_content(content_parts)
                else:
                    response = self.model.generate_content(prompt)

            return {
                "success": True,
                "response": response.text,
                "error": None,
                "prompt_tokens": (
                    response.usage_metadata.prompt_token_count
                    if hasattr(response, "usage_metadata")
                    else None
                ),
                "response_tokens": (
                    response.usage_metadata.candidates_token_count
                    if hasattr(response, "usage_metadata")
                    else None
                ),
            }

        except Exception as e:
            return {
                "success": False,
                "response": None,
                "error": str(e),
                "prompt_tokens": None,
                "response_tokens": None,
            }


# For Django views - create a singleton instance
gemini_assistant = GeminiAIAssistant()

if __name__ == "__main__":
    # Example usage
    promt = "how may stages?"
    chat_history = [
        {"role": "user", "content": "What is the weather like?"},
        {"role": "assistant", "content": "It's sunny and warm."},
        {"role": "user", "content": "What about tomorrow?"},
        {
            "role": "assistant",
            "content": "Tomorrow will be cloudy with a chance of rain.",
        },
    ]
    response = gemini_assistant.get_response(prompt=promt)
    print(response)
