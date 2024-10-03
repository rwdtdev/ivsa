import { accordionData } from '@/app/admin/users/[id]/fakeDepartmentData';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { useState } from 'react';

type AccordionData = {
  id: string;
  titleLn: string;
  children?: AccordionData[];
};

type Props = {
  departmentId?: string;
  /* eslint-disable no-unused-vars */
  setDepartmentId: (
    key: keyof UserFormData,
    value: string,
    { shouldDirty }: { shouldDirty: boolean }
  ) => void;
};

export function DepartmentAccordion({ departmentId, setDepartmentId }: Props) {
  const renderNestedLevels = (data: AccordionData[]) => {
    return data.map((item) => (
      <SubLevelComp
        key={item.id}
        item={item}
        renderNestedLevels={renderNestedLevels}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
      />
    ));
  };

  return <>{renderNestedLevels(accordionData)}</>;
}

type SubLevelCompArgs = {
  item: AccordionData;
  /* eslint-disable no-unused-vars */
  renderNestedLevels: (data: AccordionData[]) => JSX.Element[];
  departmentId?: string;
  setDepartmentId: (
    key: keyof UserFormData,
    value: string,
    { shouldDirty }: { shouldDirty: boolean }
  ) => void;
};

function SubLevelComp({
  item,
  renderNestedLevels,
  departmentId,
  setDepartmentId
}: SubLevelCompArgs) {
  const [isOpen, setIsOpen] = useState(false);

  const hasChidlren = (item: AccordionData) => {
    return Array.isArray(item.children) && item.children.length > 0;
  };

  return (
    <div className='border-l border-t'>
      <p
        className='flex cursor-pointer items-center'
        onClick={() => {
          if (hasChidlren(item)) {
            setIsOpen(!isOpen);
          } else {
            setDepartmentId('departmentId', item.id, { shouldDirty: true });
          }
        }}
      >
        {hasChidlren(item) ? (
          <span className='mr-2 text-lg font-normal'>{isOpen ? '-' : '+'}</span>
        ) : (
          <span
            className={`mr-2 h-2.5 w-2.5 shrink-0 rounded-full border ${departmentId === item.id ? 'border-red-600 bg-red-600' : 'border-black'} `}
          ></span>
        )}
        <span className={`${departmentId === item.id ? 'text-red-600' : ''}`}>
          {item.titleLn}
        </span>
      </p>
      {isOpen && (
        <div style={{ marginLeft: '20px' }}>
          {hasChidlren(item) && renderNestedLevels(item.children!)}
        </div>
      )}
    </div>
  );
}
