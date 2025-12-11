import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json({ error: 'Código de autorización requerido' });
      return;
    }

    // Intercambiar código por access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json() as GitHubTokenResponse;

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    if (!tokenData.access_token) {
      throw new Error('No se recibió access token');
    }

    // Obtener información del usuario
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userResponse.ok) {
      throw new Error('Error al obtener información del usuario');
    }

    const userData = await userResponse.json() as GitHubUser;

    // Verificar que el usuario tiene acceso al repo
    const repoResponse = await fetch('https://api.github.com/repos/Freddyz5/portafolio', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!repoResponse.ok) {
      res.status(403).json({
        error: 'No tienes acceso al repositorio'
      });
      return;
    }

    res.status(200).json({
      access_token: tokenData.access_token,
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        email: userData.email
      }
    });

  } catch (error) {
    console.error('OAuth Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error en el proceso de autenticación';
    res.status(500).json({ error: errorMessage });
  }
}
