import ForgotPasswordForm from '@/components/forms/forgot-password-form';
import { authConfig } from '@/lib/auth-options';
import { getClientIP } from '@/lib/helpers/ip';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

const ForgotPasswordPage = async () => {
  const headersList = headers();
  const ip = getClientIP(headersList);
  const session = await getServerSession(authConfig);

  const monitoringData = {
    ip,
    initiator: session?.user.name || 'Неизвестно'
  };

  return (
    <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
      <div className='m-auto'>
        <ForgotPasswordForm monitoringData={monitoringData} />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
