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
import { Cron } from '@nestjs/schedule';

@Controller('googleapis')
export class GoogleapisController {
  private salesByDealName: { [key: string]: any[][] } = {}; // Объект для хранения массивов sales по dealName
  private range: string;
  constructor(private readonly googleapisService: GoogleapisService) {}

  @Get('send')
  create(
    @Query('id') id: number,
    @Query('deal') deal: number,
    @Query('dealName') dealName: string,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('type') type: string,
  ) {
    const sale = [id, deal, dealName, name, email, phone, type];

    // Если массив для текущего dealName еще не существует, создаем его
    if (!this.salesByDealName[type]) {
      this.salesByDealName[type] = [];
    }

    this.range = type;
    console.log(sale);
    this.salesByDealName[type].push(sale);

    return 'Data added for dealName: ' + type;
  }

  @Cron('0 12,18 * * *')
  @Get('cron')
  async postToGoogleApi() {
    // Итерируемся по всем dealName в объекте salesByDealName
    for (const type in this.salesByDealName) {
      console.log(type);
      if (this.salesByDealName.hasOwnProperty(type)) {
        const values = this.salesByDealName[type];
        await this.googleapisService.create(values, type);
        // После отправки данных можно очистить массив для текущего dealName
        delete this.salesByDealName[type];
      }
    }
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
