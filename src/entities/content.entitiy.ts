import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn(
    'identity', 
    { generatedIdentity: 'ALWAYS' }
  )
  id!: number;

  @Column({ 
    type: 'varchar', 
    length: 255 
  })
  identifier!: string;

  @Column({ 
    type: 'text', 
    nullable: true 
  })
  bio!: string | null;

  @CreateDateColumn({ 
    name: "created_at", 
    type: 'timestamptz', 
    default: () => 'now()' 
  })
  createdAt!: Date;

  @UpdateDateColumn({ 
    name: "updated_at", 
    type: 'timestamptz', 
    default: () => 'now()' 
  })
  updatedAt!: Date;
}