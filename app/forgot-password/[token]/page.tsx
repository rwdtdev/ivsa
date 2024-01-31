import ResetPasswordForm from '@/components/forms/reset-password-form';

const ForgotPasswordPage = async () => {
  return (
    <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
      <div className='m-auto'>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
