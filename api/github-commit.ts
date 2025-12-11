import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from '@octokit/rest';

interface CommitRequest {
  resumeJson: string;
  commitMessage?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token de autenticación requerido' });
      return;
    }

    const githubToken = authHeader.replace('Bearer ', '');
    const { resumeJson, commitMessage }: CommitRequest = req.body;

    if (!resumeJson) {
      res.status(400).json({ error: 'resumeJson es requerido' });
      return;
    }

    // Validar JSON
    try {
      JSON.parse(resumeJson);
    } catch (e) {
      res.status(400).json({ error: 'JSON inválido' });
      return;
    }

    // Crear cliente de Octokit con el token del usuario
    const octokit = new Octokit({ auth: githubToken });

    const owner = 'Freddyz5';
    const repo = 'portafolio';
    const path = 'src/resume.json';
    const branch = 'main';

    // Verificar que el usuario tiene permisos
    try {
      await octokit.repos.get({ owner, repo });
    } catch (error) {
      res.status(403).json({ 
        error: 'No tienes permisos en este repositorio' 
      });
      return;
    }

    // Obtener SHA del archivo actual
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch
    });

    if (Array.isArray(currentFile) || currentFile.type !== 'file') {
      throw new Error('Se esperaba un archivo, no un directorio');
    }

    // Actualizar archivo
    const { data: result } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: commitMessage || `chore: update resume.json - ${new Date().toISOString()}`,
      content: Buffer.from(resumeJson).toString('base64'),
      sha: currentFile.sha,
      branch
    });

    res.status(200).json({
      success: true,
      message: 'Commit creado exitosamente',
      commit_url: result.commit.html_url,
      commit_sha: result.commit.sha
    });

  } catch (error) {
    console.error('Commit Error:', error);
    
    // Manejar errores específicos de GitHub
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      
      if (status === 401) {
        res.status(401).json({ 
          error: 'Token inválido o expirado' 
        });
        return;
      }
      
      if (status === 403) {
        res.status(403).json({ 
          error: 'Sin permisos para modificar el repositorio' 
        });
        return;
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Error al crear commit';
    res.status(500).json({ 
      error: errorMessage
    });
  }
}
