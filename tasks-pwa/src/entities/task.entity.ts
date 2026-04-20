import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export type TaskPriority = 'low' | 'medium' | 'high';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'medium'
  })
  priority: TaskPriority;

  @Column({ type: 'tinyint', width: 1, default: false })
  completed: boolean;

  @Column({ type: 'date', nullable: true, name: 'due_date' })
  dueDate: Date;

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @RelationId((task: Task) => task.user)
  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
