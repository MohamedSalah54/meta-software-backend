import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRoles } from 'src/common/enum';

export type TUser = HydratedDocument<User> & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
