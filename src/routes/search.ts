import { Router, Request, Response } from 'express';
import { search } from '../controllers/search';

const router: Router = Router();
router.get('/search', search);

router.get('*', (_: Request, res: Response) => {
  res.status(404);
  res.send({
    data: null,
    errors: [
      'This resource does not exist. Please try endpoint "/search?q=<QUERY>"'
    ]
  })
});

export default router;
