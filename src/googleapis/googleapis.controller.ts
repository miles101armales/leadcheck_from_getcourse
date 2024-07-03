import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GoogleapisService } from './googleapis.service';
import { CreateGoogleapiDto } from './dto/create-googleapi.dto';
import { UpdateGoogleapiDto } from './dto/update-googleapi.dto';

@Controller('googleapis')
export class GoogleapisController {
  constructor(private readonly googleapisService: GoogleapisService) {}

  @Get('send')
  create(
    @Query('id') id: number,
    @Query('deal') deal: number,
    @Query('dealName') dealName: string,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
  ) {
    const sale = [id, deal, dealName, name, email, phone];
    console.log(sale);
    return this.googleapisService.create(sale, dealName);
  }

  @Get()
  findAll() {
    return this.googleapisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.googleapisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGoogleapiDto: UpdateGoogleapiDto,
  ) {
    return this.googleapisService.update(+id, updateGoogleapiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleapisService.remove(+id);
  }
}
