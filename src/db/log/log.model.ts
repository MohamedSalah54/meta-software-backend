import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export type TLog = HydratedDocument<Log> & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop()
  action: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop()
  ipAddress: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
export const LogModel = MongooseModule.forFeature([
  { name: Log.name, schema: LogSchema },
]);
