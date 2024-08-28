import LoginForm from '@/components/forms/login-form';
import Header from '@/components/layout/header';

export default async function LoginPage() {
  return (
    <>
      <Header title='Аутентификация' />
      <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
        <div className='m-auto'>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
