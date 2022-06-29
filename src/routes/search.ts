import { Router, Request, Response } from 'express';
import { search } from '../controllers/search';
import { MSG_404_ERROR_INSTRUCTIONS } from '../constants';

const router: Router = Router();
router.get('/search', search);

router.get('*', (_: Request, res: Response) => {
  res.status(404);
  res.send({
    data: null,
    errors: [MSG_404_ERROR_INSTRUCTIONS]
  })
});

export default router;
