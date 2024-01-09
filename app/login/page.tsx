'use server';

import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
  return (
    <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
      <div className='m-auto'>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
