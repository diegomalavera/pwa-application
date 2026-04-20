import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './services/app.service';
import { IndexController } from './controllers/index.controller';
import { AuthController } from './controllers/auth.controller';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER ?? 'tasks',
      password: process.env.DB_PASSWORD ?? 'alpha567',
      database: process.env.DB_NAME ?? 'tasks',
      entities: [User, Task],
      synchronize: false,
      logging: false,
    }),
    TypeOrmModule.forFeature([User, Task])
  ],
  controllers: [IndexController, AuthController, TasksController],
  providers: [AppService, TasksService, UserService],
})
export class AppModule {}
