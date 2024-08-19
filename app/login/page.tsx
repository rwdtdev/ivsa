import LoginForm from '@/components/forms/login-form';
import Header from '@/components/layout/header';
import { getClientIP } from '@/lib/helpers/ip';
import { headers } from 'next/headers';

export default async function LoginPage() {
  const headersList = headers();
  const ip = getClientIP(headersList);

  const monitoringData = {
    ip: ip || 'нет данных',
  };

  return (
    <>
      <Header title='Аутентификация' />
      <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
        <div className='m-auto'>
          <LoginForm monitoringData={monitoringData} />
        </div>
      </div>
    </>
  );
}
