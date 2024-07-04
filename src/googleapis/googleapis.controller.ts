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
  ) {
    const sale = [id, deal, dealName, name, email, phone];

    // Если массив для текущего dealName еще не существует, создаем его
    if (!this.salesByDealName[dealName]) {
      this.salesByDealName[dealName] = [];
    }

    this.range = dealName;
    console.log(sale);
    this.salesByDealName[dealName].push(sale);

    return 'Data added for dealName: ' + dealName;
  }

  @Cron('0 12,18 * * *')
  @Get('cron')
  async postToGoogleApi() {
    // Итерируемся по всем dealName в объекте salesByDealName
    for (const dealName in this.salesByDealName) {
      console.log(dealName);
      if (this.salesByDealName.hasOwnProperty(dealName)) {
        const values = this.salesByDealName[dealName];
        await this.googleapisService.create(values, dealName);
        // После отправки данных можно очистить массив для текущего dealName
        delete this.salesByDealName[dealName];
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
