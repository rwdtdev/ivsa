import ForgotPasswordForm from '@/components/forms/forgot-password-form';

const ForgotPasswordPage = async () => {
  return (
    <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
      <div className='m-auto'>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
