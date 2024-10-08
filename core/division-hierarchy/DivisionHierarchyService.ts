import _ from 'underscore';
import { CreateDivisionHierarchyDTO } from '@/app/api/division-hierarchies/dtos/create-division-hierarchy.dto';
import prisma from '@/core/prisma';
import { NotFoundError } from '@/lib/problem-json';
import { TransactionSession } from '@/types/prisma';
import { DivisionHierarchy, DivisionHierarchyNode, PrismaClient } from '@prisma/client';
import { DivisionHierarchyErrors } from './errors';
import { DivisionHierarchyNodeWithNodes, DivisionHierarchyWithNodes } from './types';

function makeTree(list: DivisionHierarchyNode[], item?: DivisionHierarchyNode): any {
  if (!item) {
    item = list.find((item) => item.parentId === '00006417');
    return [
      {
        ..._.omit(item, 'divisionHierarchyId'),
        nodes: list
          .filter((node) => node.parentId === item?.id)
          .sort((a, b) => a.titleLn.localeCompare(b.titleLn))
          .map((node) => makeTree(list, node))
      }
    ] as DivisionHierarchyNodeWithNodes[];
  }

  return {
    ..._.omit(item, 'divisionHierarchyId'),
    nodes: list
      // .filter((node) => node.parentId === item?.id)
      .filter((node) => node.parentId === item?.id)
      .sort((a, b) => a.titleLn.localeCompare(b.titleLn))
      .map((node) => makeTree(list, node))
  } as DivisionHierarchyNodeWithNodes;
}

const addHierarchyId =
  (divisionHierarchyId: string) =>
  (node: Omit<DivisionHierarchyNode, 'divisionHierarchyId'>) => ({
    ...node,
    divisionHierarchyId
  });

export class DivisionHierarchyService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session || prisma;
  }

  withSession(session: TransactionSession) {
    return new DivisionHierarchyService(session);
  }

  async assertExistByExternalId(id: string, status: number = 404) {
    const count = await this.prisma.divisionHierarchy.count({ where: { hierId: id } });

    if (!count || count === 0) {
      throw new NotFoundError({
        detail: `Division hierarchy with external id (${id}) not found`,
        status
      });
    }
  }

  async getAll(): Promise<DivisionHierarchyWithNodes[]> {
    const divisionHierarchies = await this.prisma.divisionHierarchy.findMany({
      include: {
        divisionHierarchyNodes: {
          where: { from: { lte: new Date() }, to: { gte: new Date() } }
        }
      }
    });

    return divisionHierarchies.map((divisionHierarchy) => {
      const rootNodes = divisionHierarchy.divisionHierarchyNodes.filter(
        (rootNode) => rootNode.divisionHierarchyId === divisionHierarchy.id
      );

      return {
        ..._.omit(divisionHierarchy, 'divisionHierarchyNodes'),
        nodes: makeTree(rootNodes)
      };
    });
  }

  async getByHierId(hierId: string) {
    return this.prisma.divisionHierarchy.findFirst({
      where: { hierId },
      include: { divisionHierarchyNodes: true }
    });
  }

  async getById(id: string): Promise<DivisionHierarchy | null> {
    return this.prisma.divisionHierarchy.findFirst({
      where: { id },
      include: { divisionHierarchyNodes: true }
    });
  }

  /* getDivisionNodeById работает только если все id в DivisionHierarchyNode
  уникальны. По-хорошему надо использовать getById но в User мы пока храним только divisionId из DivisionHierarchyNode и не храним id DivisionHierarchy */
  async getDivisionNodeById(id: string): Promise<DivisionHierarchyNode | null> {
    return this.prisma.divisionHierarchyNode.findUnique({
      where: { id }
    });
  }

  async getDivisionNodesByTitle(title: string): Promise<DivisionHierarchyNode[] | null> {
    return this.prisma.divisionHierarchyNode.findMany({
      where: {
        from: { lte: new Date() },
        to: { gte: new Date() },
        OR: [
          { titleLn: { contains: title, mode: 'insensitive' } },
          { titleMd: { contains: title, mode: 'insensitive' } },
          { titleSh: { contains: title, mode: 'insensitive' } }
        ]
      }
    });
  }

  async create(divisionHierarchy: CreateDivisionHierarchyDTO) {
    const newHierarchy = _.omit(divisionHierarchy, 'nodes');
    const newHierarchyNodes = divisionHierarchy.nodes;

    const existHierarchy = await this.getByHierId(newHierarchy.hierId);

    if (!existHierarchy) {
      const createdHierarchy = await this.prisma.divisionHierarchy.create({
        data: _.omit(newHierarchy, 'partNum')
      });

      if (newHierarchyNodes.length > 0) {
        await this.prisma.divisionHierarchyNode.createMany({
          data: newHierarchyNodes.map(addHierarchyId(createdHierarchy.id))
        });
      }

      return await this.getById(createdHierarchy.id);
    } else {
      const isSameSession = existHierarchy.sessionId === newHierarchy.sessionId;

      if (isSameSession) {
        const isFullfilledHierarchy = newHierarchy.partNum > existHierarchy.parts;

        if (isFullfilledHierarchy) {
          throw new DivisionHierarchyErrors.AlreadyHaveMaximumPartitions({
            detail: `Hierarchy ${existHierarchy.hierId} already fullfilled. Current part ${newHierarchy.partNum}, maximum ${existHierarchy.parts} parts`
          });
        }

        // @TODO может быть долго, возможно стоит все таки написать запрос к БД с проверкой на вхождения ID
        const isContaintDuplicateNodes = newHierarchyNodes.some((node) =>
          existHierarchy.divisionHierarchyNodes.some(
            (existNode) => existNode.id === node.id
          )
        );

        if (isContaintDuplicateNodes) {
          throw new DivisionHierarchyErrors.AlreadyContainNodes({
            detail: `Hierarchy ${existHierarchy.hierId} already contains duplicated nodes`
          });
        }

        await this.prisma.divisionHierarchyNode.createMany({
          data: newHierarchyNodes.map(addHierarchyId(existHierarchy.id))
        });

        return await this.getById(existHierarchy.id);
      } else {
        await this.prisma.divisionHierarchyNode.deleteMany({
          where: { divisionHierarchyId: existHierarchy.id }
        });

        await this.prisma.divisionHierarchyNode.createMany({
          data: newHierarchyNodes.map(addHierarchyId(existHierarchy.id))
        });

        await this.prisma.divisionHierarchy.update({
          where: { id: existHierarchy.id },
          data: { sessionId: newHierarchy.sessionId }
        });

        return await this.getById(existHierarchy.id);
      }
    }
  }
}
