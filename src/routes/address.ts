import Router from '@koa/router';
import AddressController from '../controllers/AddressController';
import { authenticate } from '../middlewares/auth';

const router = new Router({
  prefix: '/api',
});

// 所有地址接口都需要认证
router.get('/user/addresses', authenticate, AddressController.getUserAddresses);
router.get('/user/addresses/default', authenticate, AddressController.getDefaultAddress);
router.get('/user/addresses/:id', authenticate, AddressController.getAddressById);
router.post('/user/addresses', authenticate, AddressController.createAddress);
router.put('/user/addresses/:id', authenticate, AddressController.updateAddress);
router.delete('/user/addresses/:id', authenticate, AddressController.deleteAddress);
router.put('/user/addresses/:id/default', authenticate, AddressController.setDefaultAddress);

export default router;
