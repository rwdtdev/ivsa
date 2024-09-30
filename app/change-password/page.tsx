import ChangePasswordForm from '@/components/forms/change-password-form';

const ChangePasswordPage = async () => {
  return (
    <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
      <div className='m-auto'>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;