import { EntitySchema } from "typeorm";

export type Content = {
  id: number;
  identifier: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const Content = new EntitySchema<Content>({
  name: "Content",
  tableName: "content",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    identifier: {
      type: "varchar",
      length: 255,
    },
    bio: {
      type: "text",
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamptz",
      createDate: true,
      default: () => "now()",
    },
    updatedAt: {
      name: "updated_at",
      type: "timestamptz",
      updateDate: true,
      default: () => "now()",
    },
  },
});
