import { CreateDivisionHierarchyDTO } from '@/app/api/division-hierarchies/dtos/create-division-hierarchy.dto';
import prisma from '@/core/prisma';
import { NotFoundError } from '@/lib/problem-json';
import { TransactionSession } from '@/types/prisma';
import { DivisionHierarchy, DivisionHierarchyNode, PrismaClient } from '@prisma/client';
import _ from 'underscore';
import { DivisionHierarchyErrors } from './errors';

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

  async getAll(): Promise<DivisionHierarchy[]> {
    return this.prisma.divisionHierarchy.findMany({
      include: {
        divisionHierarchyNodes: true
      }
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
        const isFullfilledHierarchy =
          existHierarchy.divisionHierarchyNodes.length === existHierarchy.parts;

        if (isFullfilledHierarchy) {
          throw new DivisionHierarchyErrors.AlreadyHaveMaximumNodes({
            detail: `Hierarchy ${existHierarchy.hierId} already have maximum ${existHierarchy.parts} nodes`
          });
        }

        const isWillBeOverflowedByNodesCount =
          existHierarchy.divisionHierarchyNodes.length + newHierarchyNodes.length >
          existHierarchy.parts;

        if (isWillBeOverflowedByNodesCount) {
          throw new DivisionHierarchyErrors.WillBeOverflowMaximumNodes({
            detail: `Hierarchy ${existHierarchy.hierId} will be overflowed by the number of nodes. Maximum ${existHierarchy.parts}, current ${existHierarchy.divisionHierarchyNodes.length}`
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
            detail: `Hierarchy ${existHierarchy.hierId} already contains the nodes`
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
