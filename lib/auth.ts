import api from '@/utils/api';
import Cookies from 'js-cookie';

export async function loginUser(email: string, password: string) {
  const res = await api.post('/login', {
    email,
    password,
  });

  const token = res.data.token;
  const user = res.data.user_info;

  Cookies.set('token', token, { expires: 1 });
  Cookies.set('role', user.role, { expires: 1 });

  return user;
}
