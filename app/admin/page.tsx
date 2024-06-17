import Header from '@/components/layout/header';

export default async function page() {
  return (
    <>
      <Header title='Дашборд' />
      <div className='flex h-screen overflow-hidden'>
        <main className='w-full p-16'></main>
      </div>
    </>
  );
}
