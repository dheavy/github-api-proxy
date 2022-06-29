import { Response, Request } from 'express';
import {
  MSG_QUERY_ERROR_INSTRUCTIONS,
  MSG_ERROR_RATE_GITHUB,
  MSG_RATE_LIMIT_INSTRUCTIONS,
  MSG_ERROR_UNKNOWN
} from '../constants';
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

    // Fetch users and their 5 last updated repos.
    // Limit items per page, as each resulting users leads to O(n) API calls for repos.
    // Add repos as a field of the result payload.
    const { data: users } = await octokit.rest.search.users({
      q: q.toString(),
      per_page: 5
    });

    const repositories: Array<any> = [];

    if (users?.items?.length) {
      for (let i = 0; i < users.items.length; i++) {
        const user = users.items[i];
        const { login: username } = user;
        const { data: repos } = await octokit.rest.repos.listForUser({
          username,
          per_page: 5,
          sort: 'updated'
        });
        repositories.push(repos);
      }
    }

    res.status(200).json({ data: { users: users || [], repositories } });
  } catch (err) {
    console.error(err);

    let message: string;
    let statusCode: number;

    if ((err as any).toString().includes(MSG_ERROR_RATE_GITHUB)) {
      message = MSG_RATE_LIMIT_INSTRUCTIONS,
      statusCode = 429
    } else {
      message = MSG_ERROR_UNKNOWN,
      statusCode = 500;
    }

    res.status(statusCode);
    res.send({
      data: null,
      errors: [message]
    });
  }
}
