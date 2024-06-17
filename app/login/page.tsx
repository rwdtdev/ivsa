import LoginForm from '@/components/forms/login-form';
import Header from '@/components/layout/header';
import { revalidatePath } from 'next/cache';

export default function LoginPage() {
  async function revalidateMainLayout() {
    // для обновления Header (Header находится в main Layout)
    'use server';
    revalidatePath('/', 'layout');
  }

  return (
    <>
      <Header title='Аутентификация' />
      <div className='flex h-screen place-content-center bg-gradient-to-r from-gray-500'>
        <div className='m-auto'>
          <LoginForm revalidateMainLayout={revalidateMainLayout} />
        </div>
      </div>
    </>
  );
}
