import { Response, Request } from 'express';
import { MSG_QUERY_ERROR_INSTRUCTIONS } from '../constants';

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
    })
  }
}
