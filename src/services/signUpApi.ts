import axios from 'axios';
import { config } from '@/config';

const api = axios.create({
  baseURL: config.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const signUpAPI =  {
registerUser: async (userData: {
    //salutations_id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    //role_id: number;
    phone: string;
  }) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('User with this email already exists');
      } else if (error.response?.status === 400) {
        throw new Error('Please check your registration details');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  }
}
