import { DivisionHierarchyNode } from '@prisma/client';
import { CreateDivisionHierarchyData } from '../validation';

export class CreateDivisionHierarchyDTO {
  public sessionId: string;
  public partNum: number;
  public parts: number;
  public hierId: string;
  public titleSh: string;
  public titleMd: string;
  public titleLn: string;
  public nodes: Array<Omit<DivisionHierarchyNode, 'divisionHierarchyId'>>;

  constructor(data: CreateDivisionHierarchyData) {
    this.sessionId = data.session_id;
    this.partNum = Number.parseInt(data.part_num);
    this.parts = Number.parseInt(data.parts);
    this.hierId = data.hierid;
    this.titleSh = data.title_sh;
    this.titleMd = data.title_md;
    this.titleLn = data.title_ln;
    this.nodes = data.hier_nodes.map((hierNode) => ({
      id: hierNode.nodeid,
      name: hierNode.nodename,
      parentId: hierNode.parentid,
      from: new Date(hierNode.datefrom),
      to: new Date(hierNode.dateto),
      level: Number.parseInt(hierNode.tlevel),
      divType: hierNode.divtype,
      titleSh: hierNode.title_sh,
      titleMd: hierNode.title_md,
      titleLn: hierNode.title_ln,
      bukrs: hierNode.bukrs
    }));
  }
}
