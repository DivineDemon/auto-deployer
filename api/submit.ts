import type { VercelRequest, VercelResponse } from '@vercel/node';

export const submit = async ({
  name,
  content,
}: {
  name: string;
  content: string;
}) => {
  const response = await fetch(
    "https://n8n.scintia.ai/webhook/30cb02bd-6104-4847-8650-d7bd03265872",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        content,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create deployment.");
  }
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { repoName, fileContent } = request.body;

    if (!repoName || !fileContent) {
      return response.status(400).json({ error: 'Missing repository name or file content' });
    }

    await submit({ name: repoName, content: fileContent });
    
    return response.status(200).json({
      message: `Successfully submitted deployment for repository: ${repoName}`
    });

  } catch (error: any) {
    console.error('Error processing request:', error);
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
