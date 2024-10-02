type DivisionHierarchy = {
  id: string;
  hierId: string;
  sessionId: string;
  parts: number;
  titleSh: string;
  titleMd: string;
  titleLn: string;
  createdAt: string;
  updatedAt: string;
  divisionHierarchyNodes: DivisionHierarchyNode[];
};

type DivisionHierarchyNode = {
  id: string;
  name: string;
  parentId: string;
  from: string;
  to: string;
  level: number;
  divType: string;
  titleSh: string;
  titleMd: string;
  titleLn: string;
  bukrs: string;
  divisionHierarchyId: string;
  children?: DivisionHierarchyNode[];
};

export const fakeDepartmentData: DivisionHierarchy[] = [
  {
    id: '241e80a2-913d-4a85-b475-1336eee67750',
    hierId: 'RZD_SBO',
    sessionId: '0000000001',
    parts: 10,
    titleSh: 'БУХ. ОТЧЕТНОСТЬ',
    titleMd: 'Сводная бухгалтерская отчетность',
    titleLn: 'Сводная бухгалтерская отчетность',
    createdAt: '2024-10-01T13:19:52.183Z',
    updatedAt: '2024-10-01T13:19:52.183Z',
    divisionHierarchyNodes: [
      {
        id: '00006417',
        name: 'GRPCOMP',
        parentId: '00000000',
        from: '2003-10-01T00:00:00.000Z',
        to: '9999-12-31T00:00:00.000Z',
        level: 1,
        divType: 'X',
        titleSh: 'Группа юр. лиц',
        titleMd: 'ГРУППА ЮРИДИЧЕСКИХ ЛИЦ',
        titleLn: 'Группа юридических лиц',
        bukrs: '',
        divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750',
        children: [
          {
            id: '00000001',
            name: 'RZD',
            parentId: '00006417',
            from: '2003-10-01T00:00:00.000Z',
            to: '9999-12-31T00:00:00.000Z',
            level: 2,
            divType: 'A',
            titleSh: 'ОАО "РЖД"',
            titleMd: 'ОТКРЫТОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "РОССИЙСКИЕ ЖЕЛЕЗНЫЕ ДОРОГИ"',
            titleLn: 'Открытое акционерное общество "Российские железные дороги"',
            bukrs: '',
            divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750',
            children: [
              {
                id: '00000002',
                name: '10C07900',
                parentId: '00000001',
                from: '2003-10-01T00:00:00.000Z',
                to: '2009-12-31T00:00:00.000Z',
                level: 3,
                divType: 'N',
                titleSh: 'ММЗ ОАО "РЖД"',
                titleMd: 'МОСКОВСКИЙ МЗ "КРАСНЫЙ ПУТЬ" ОАО "РЖД"',
                titleLn: 'Московский МЗ "Красный путь" ОАО "РЖД"',
                bukrs: '',
                divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750',
                children: [
                  {
                    id: '00000170',
                    name: '00000080',
                    parentId: '00000002',
                    from: '2003-10-01T00:00:00.000Z',
                    to: '2009-12-31T00:00:00.000Z',
                    level: 4,
                    divType: 'E',
                    titleSh: 'ММЗ ОАО "РЖД"',
                    titleMd: 'МОСКОВСКИЙ МЗ "КРАСНЫЙ ПУТЬ" ОАО "РЖД"',
                    titleLn: 'Московский МЗ "Красный путь" ОАО "РЖД"',
                    bukrs: '1177',
                    divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750'
                  },
                  {
                    id: '00000019',
                    name: '10C04900',
                    parentId: '00000002',
                    from: '2003-10-01T00:00:00.000Z',
                    to: '2007-12-31T00:00:00.000Z',
                    level: 3,
                    divType: 'N',
                    titleSh: 'Кавжелдорпроект',
                    titleMd: '"КАВЖЕЛДОРПРОЕКТ" - ФИЛИАЛ ОАО "РЖД"',
                    titleLn:
                      'Ростовский проектно-изыскательский институт"Кавжелдорпроект"-филиал ОАО "РЖД"',
                    bukrs: '1117',
                    divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750',
                    children: [
                      {
                        id: '00009671',
                        name: '76600400',
                        parentId: '00000019',
                        from: '2013-04-01T00:00:00.000Z',
                        to: '9999-12-31T00:00:00.000Z',
                        level: 4,
                        divType: 'E',
                        titleSh: 'ДЭЗ СВЖД',
                        titleMd:
                          'СВЕРДЛОВСКАЯ ДИРЕКЦИЯ ПО ЭКСПЛУАТАЦИИ ЗДАНИЙ И СООРУЖЕНИЙ',
                        titleLn:
                          'СВЕРДЛОВСКАЯ ДИРЕКЦИЯ ПО ЭКСПЛУАТАЦИИ ЗДАНИЙ И СООРУЖЕНИЙ СП СВЕРДЛОВСКОЙ ЖЕЛЕЗНОЙ ДОРОГИ - ФИЛИАЛА ОАО РЖД',
                        bukrs: '6004',
                        divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750'
                      },
                      {
                        id: '00009742',
                        name: '76606200',
                        parentId: '00000019',
                        from: '2014-01-01T00:00:00.000Z',
                        to: '9999-12-31T00:00:00.000Z',
                        level: 4,
                        divType: 'E',
                        titleSh: 'СВХТЛ СВЖД',
                        titleMd: 'СВЕРДЛОВСКАЯ ХИМИКО-ТЕХНИЧЕСКАЯ ЛАБОРАТОРИЯ',
                        titleLn:
                          'СВЕРДЛОВСКАЯ ХИМИКО-ТЕХНИЧЕСКАЯ ЛАБОРАТОРИЯ СП СВЕРДЛОВСКОЙ ЖЕЛЕЗНОЙ ДОРОГИ - ФИЛИАЛА ОАО РЖД',
                        bukrs: '6062',
                        divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750'
                      },
                      {
                        id: '00009755',
                        name: '76600002',
                        parentId: '00000019',
                        from: '2014-01-01T00:00:00.000Z',
                        to: '9999-12-31T00:00:00.000Z',
                        level: 4,
                        divType: 'E',
                        titleSh: 'УЧЕТ ОП по ПП',
                        titleMd: 'УЧЕТ ОПЕРАЦИЙ ПО ПАССАЖИРСКИМ ПЕРЕВОЗКАМ НА СВР Ж.Д.',
                        titleLn: 'Учет операций по пассажирским перевозкам на СВР ж.д.',
                        bukrs: '6000',
                        divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750'
                      },
                      {
                        id: '00009804',
                        name: '76629000',
                        parentId: '00000019',
                        from: '2015-01-01T00:00:00.000Z',
                        to: '9999-12-31T00:00:00.000Z',
                        level: 4,
                        divType: 'E',
                        titleSh: 'ДСС СВЖД',
                        titleMd: 'ДИРЕКЦИЯ СОЦИАЛЬНОЙ СФЕРЫ СП СВЕРДЛОВСКОЙ Ж.Д.',
                        titleLn:
                          'Дирекция социальной сферы СП Свердловской железной дороги - филиала ОАО "РЖД"',
                        bukrs: '6292',
                        divisionHierarchyId: '241e80a2-913d-4a85-b475-1336eee67750'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
