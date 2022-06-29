import { Response, Request } from 'express';
import { MSG_QUERY_ERROR_INSTRUCTIONS } from '../constants';
import { Octokit } from '@octokit/rest';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure query string format.
    const { q } = req.query;
    if (!q) {
      res.status(400);
      res.send({
        data: null,
        errors: [MSG_QUERY_ERROR_INSTRUCTIONS]
      });
      return;
    }

    // Configure a Github Octokit client.
    // Set dates on payload to (hopefully) see them in local timezone.
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const auth = process.env.PERSONAL_ACCESS_TOKEN || '';
    const octokit = new Octokit({
      auth,
      timeZone: currentTimeZone
    });

    res.status(200).json({
      data: {
        users: [],
        repositories: []
      }
    });
  } catch (err) {
    console.error(err);

    res.status(500);
    res.send({
      data: null,
      errors: ['oops!']
    });
  }
}
