import ResetPasswordForm from '@/components/ResetPasswordForm';

const ForgotPasswordPage = () => {
  // @TODO: get token from params.

  return (
    <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
      <div className='m-auto'>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
