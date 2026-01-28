import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskStatus } from 'src/common/enum';

export type TTask = HydratedDocument<Task> & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop()
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: TaskStatus.AVAILABLE })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export const TaskModel = MongooseModule.forFeature([
  { name: Task.name, schema: TaskSchema },
]);
