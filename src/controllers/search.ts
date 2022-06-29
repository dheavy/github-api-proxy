import { Response, Request } from 'express';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
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
