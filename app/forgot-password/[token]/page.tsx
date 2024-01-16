import { verify } from 'jsonwebtoken';
import { usePathname } from 'next/navigation';
import ResetPasswordForm from '@/components/forms/reset-password-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JwtSecret } from '@/constants/jwt';

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
