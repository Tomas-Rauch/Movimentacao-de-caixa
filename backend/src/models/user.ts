import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: 'user' })
  role: 'admin' | 'user'

  @Column({ nullable: true })
  resetPasswordToken?: string

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry?: Date
}
