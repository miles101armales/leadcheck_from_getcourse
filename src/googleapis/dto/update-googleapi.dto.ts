import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleapiDto } from './create-googleapi.dto';

export class UpdateGoogleapiDto extends PartialType(CreateGoogleapiDto) {}
