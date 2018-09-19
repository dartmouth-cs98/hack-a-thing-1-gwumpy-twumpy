import { Router } from 'express';
import * as Users from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.route('/users')
  .post(Users.createUser)
  .delete(Users.deleteUser);

export default router;
