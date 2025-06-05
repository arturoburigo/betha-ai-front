
interface GenerateRequest {
  query: string;
  top_k: number;
}

interface GenerateResponse {
  llm_response: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async generateResponse(query: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          top_k: 5
        } as GenerateRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GenerateResponse = await response.json();
      return data.llm_response;
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      throw new Error('Falha ao obter resposta da API');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Erro no health check:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
