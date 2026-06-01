import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('gallery_item')
export class GalleryItem {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @Column({ default: '' })
  description!: string;

  @Column()
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
