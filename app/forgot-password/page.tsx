'use server';

import ForgotPasswordForm from '@/components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
      <div className='m-auto'>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
