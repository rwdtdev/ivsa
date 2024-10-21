import { DivisionHierarchyNodeWithNodes } from '@/core/division-hierarchy/types';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { useState } from 'react';

type Props = {
  divisionId: string | null;
  /* eslint-disable no-unused-vars */
  formSetDepartmentId: (
    key: keyof UserFormData,
    value: string,
    { shouldDirty }: { shouldDirty: boolean }
  ) => void;
  divisionsData: DivisionHierarchyNodeWithNodes[];
};

export function DepartmentAccordion({
  divisionId,
  formSetDepartmentId,
  divisionsData
}: Props) {
  const renderNestedLevels = (data: DivisionHierarchyNodeWithNodes[]) => {
    return data.map((item) => (
      <SubLevelComp
        key={item.id}
        item={item}
        renderNestedLevels={renderNestedLevels}
        departmentId={divisionId}
        setDepartmentId={formSetDepartmentId}
      />
    ));
  };

  return <>{renderNestedLevels(divisionsData)}</>;
}

type SubLevelCompArgs = {
  item: DivisionHierarchyNodeWithNodes;
  /* eslint-disable no-unused-vars */
  renderNestedLevels: (data: DivisionHierarchyNodeWithNodes[]) => JSX.Element[];
  departmentId: string | null;
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

  const hasChildren = (item: DivisionHierarchyNodeWithNodes) => {
    return Array.isArray(item.nodes) && item.nodes.length > 0;
  };

  return (
    <div className='border-l border-t'>
      <p
        className='flex cursor-pointer items-center'
        onClick={() => {
          if (hasChildren(item)) {
            setIsOpen(!isOpen);
          } else {
            setDepartmentId('divisionId', item.id, { shouldDirty: true });
          }
        }}
      >
        {hasChildren(item) ? (
          <span className='mr-2 text-lg font-normal'>{isOpen ? '-' : '+'}</span>
        ) : (
          <span
            className={`mr-2 h-2.5 w-2.5 shrink-0 rounded-full border ${departmentId === item.id ? 'border-green-600 bg-green-600' : 'border-black'} `}
          ></span>
        )}
        <span
          className={`text-sm ${departmentId === item.id ? 'text-green-600' : ''}`}
          onClick={() => {
            console.log(item.id);
          }}
        >
          {item.titleLn}
          {/* {'<><>'}
          {divisionTypes[item.divType as keyof typeof divisionTypes]} */}
        </span>
      </p>
      {isOpen && (
        <div style={{ marginLeft: '20px' }}>
          {hasChildren(item) && renderNestedLevels(item.nodes)}
        </div>
      )}
    </div>
  );
}
