import axios from 'axios';
import { FlashcardSuggestionDto, GenerateFlashcardsResponseDto } from '../../../shared/types/dto';
import { GenerateFlashcardsCommand } from '../../../shared/types/commands';
import { config } from '../config/environment';

export class AIService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = config.openRouter.apiKey;
    this.apiUrl = config.openRouter.url;

    console.log('this.apiKey: ', this.apiKey)

    if (!this.apiKey) {
      console.warn('OPENROUTER_API_KEY is not set in environment variables');
    }
  }

  /**
   * Generates flashcard suggestions from text using OpenRouter.ai
   * @param command The command containing text and desired count
   * @returns A promise resolving to flashcard suggestions
   */
  async generateFlashcards(command: GenerateFlashcardsCommand): Promise<GenerateFlashcardsResponseDto> {
    
    
    console.log('this.apiKey: ', this.apiKey)
    
    try {
      if (!this.apiKey) {
        throw new Error('OPENROUTER_API_KEY is not configured');
      }

      // Prepare the prompt for the AI model
      const prompt = this.buildPrompt(command.text, command.count);
      
      // Make API request to OpenRouter
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'openai/gpt-3.5-turbo', // Default model, can be made configurable
          messages: [
            {
              role: 'system',
              content: 'You are an expert educator specializing in creating high-quality flashcards for learning. Your task is to generate the specified number of flashcards from the provided text.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://10xcards.com', // Replace with your actual domain
          },
        }
      );

      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error('Invalid response from AI service');
      }

      // Parse AI response
      const aiResponse = JSON.parse(response.data.choices[0].message.content);
      
      // Map AI response to FlashcardSuggestionDto array
      return {
        suggestions: this.parseFlashcards(aiResponse, response.data),
      };
    } catch (error: unknown) {
      console.error('Error calling AI service:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Rate limit exceeded with AI service');
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate flashcards: ${errorMessage}`);
    }
  }

  /**
   * Builds the prompt for the AI model
   * @param text The source text
   * @param count The number of flashcards to generate
   * @returns The formatted prompt
   */
  private buildPrompt(text: string, count: number): string {
    return `
Generate ${count} high-quality flashcards from the following text. 
Each flashcard should have a clear question on the front and a concise answer on the back.
The flashcards should cover the most important information from the text.

Text:
${text}

Respond with a JSON object in this exact format:
{
  "flashcards": [
    {
      "front": "Front of flashcard 1 (question)",
      "back": "Back of flashcard 1 (answer)"
    },
    ...more flashcards
  ]
}
`;
  }

  /**
   * Parses and maps the AI response to FlashcardSuggestionDto array
   * @param aiResponse The parsed AI response
   * @param rawResponse The raw API response for metadata
   * @returns Array of flashcard suggestions
   */
  private parseFlashcards(aiResponse: any, rawResponse: any): FlashcardSuggestionDto[] {
    if (!aiResponse.flashcards || !Array.isArray(aiResponse.flashcards)) {
      throw new Error('Invalid AI response format: missing flashcards array');
    }

    // Extract useful metadata
    const metadata = {
      model: rawResponse.model,
      created: rawResponse.created,
      id: rawResponse.id,
      usage: rawResponse.usage,
    };

    // Map to DTO format
    return aiResponse.flashcards.map((card: any, index: number) => ({
      id: `tmp-${index + 1}`,
      front: card.front,
      back: card.back,
      generation_info: {
        ...metadata,
        index: index,
      },
    }));
  }
} 