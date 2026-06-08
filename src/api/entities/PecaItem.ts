import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('peca_item')
export class PecaItem {
  @PrimaryColumn()
  id!: string;

  @Column()
  category!: string;

  @Column()
  name!: string;

  @Column()
  material!: string;

  @Column('numeric', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  status!: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true, name: 'image_url', type: 'text' })
  imageUrl?: string;

  @Column({ default: false })
  shine!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
