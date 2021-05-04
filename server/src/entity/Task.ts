import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200 })
  content: string;

  @Column({ type: "varchar", length: 50, default: null })
  userId: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: "timestamp", default: null })
  completedAt: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
