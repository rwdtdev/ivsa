'use client';

import BreadCrumb from '@/components/breadcrumb';

// import { UsersTable } from '@/components/tables/user-tables/table';
import { DataTable } from '@/components/data-table/data-table';
import React from 'react';
// import { searchableColumns } from '@/components/tables/users-table/columns';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/hooks/use-data-table';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { fetchAuditsTableColumnDefs } from '@/components/tables/audits-table/columns';

const breadcrumbItems = [
  { title: 'Архив видеоинвентаризаций', link: '/admin/events/audit' }
];

export default function AuditEventsPage() {
  // Learn more about React.use here: https://react.dev/reference/react/use
  const [isPending, startTransition] = React.useTransition();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<any, unknown>[]>(
    () => fetchAuditsTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const archive = [
    {
      commandId: 'd2b12a2d-9665-47ab-b8f3-78b8e850e2e4',
      commandNumber: '21',
      commandDate: '09-04-2023',
      orderId: 'db802048-5605-4cfa-b601-a1fd03a8894e',
      orderNumber: '21',
      orderDate: '09-04-2023',
      auditStart: '10-04-2023',
      auditEnd: '12-04-2023',
      balanceUnit: '5n1yT',
      balanceUnitRegionCode: '77',
      participants: [
        {
          tabelNumber: '1111-1111-11',
          roleId: 1
        },
        {
          tabelNumber: '2222-2222-222',
          roleId: 2
        }
      ]
    },
    {
      commandId: '33aa04d6-6e12-44a5-82ad-7e25de0686c7',
      commandNumber: '22',
      commandDate: '15-06-2023',
      orderId: '74a771a6-f961-4abb-a230-ad98e05e4f90',
      orderNumber: '22',
      orderDate: '15-04-2023',
      auditStart: '20-04-2023',
      auditEnd: '21-04-2023',
      balanceUnit: '1n05H',
      balanceUnitRegionCode: '77',
      participants: [
        {
          tabelNumber: '1111-1111-11',
          roleId: 1
        },
        {
          tabelNumber: '2222-2222-222',
          roleId: 2
        }
      ]
    },
    {
      commandId: '35d690e7-3247-460c-ac98-df2b3b502471',
      commandNumber: '23',
      commandDate: '23-12-2023',
      orderId: '5a32e785-38e1-4cd8-b57c-2428164b04fe',
      orderNumber: '23',
      orderDate: '10-04-2023',
      auditStart: '11-04-2023',
      auditEnd: '13-04-2023',
      balanceUnit: '2k03P',
      balanceUnitRegionCode: '77',
      participants: [
        {
          tabelNumber: '1111-1111-11',
          roleId: 1
        },
        {
          tabelNumber: '2222-2222-222',
          roleId: 2
        }
      ]
    }
  ];

  const { dataTable } = useDataTable({
    data: archive,
    columns,
    pageCount: 1
    // searchableColumns
    // filterableColumns
  });

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <BreadCrumb items={breadcrumbItems} />
      {/* <UsersTable data={formattedUsers} /> */}

      <div className='flex items-start justify-between'>
        <Heading
          title={`Архив видеоинвентаризаций (${archive.length})`}
          description='Управление архивом видеоинвентаризаций'
        />
        <Button className='text-xs md:text-sm' onClick={() => {}}>
          <Plus className='mr-2 h-4 w-4' /> Добавить
        </Button>
      </div>
      <Separator />

      <React.Suspense
        fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
      >
        <DataTable
          dataTable={dataTable}
          columns={columns}
          // searchableColumns={searchableColumns}
          // filterableColumns={filterableColumns}
          // floatingBarContent={TasksTableFloatingBarContent(dataTable)}
          // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
        />
      </React.Suspense>
    </div>
  );
}
