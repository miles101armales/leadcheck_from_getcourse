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
  private rangeMappings: { [key: string]: string } = {
    vk1: 'ВК - 1 день',
    vk2: 'ВК - 2 день',
    rs1: 'РСЯ - 1 день',
    rs2: 'РСЯ - 2 день',
    prdsp: 'Предсписки',
    // Добавьте другие соответствия, если необходимо
  };

  constructor(private readonly googleapisService: GoogleapisService) {}

  @Get('send')
  create(
    @Query('id') id: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('type') type: string, // Используйте vkType вместо type для передачи vk1, vk2 и т.д.
  ) {
    const now = new Date();

    // Форматирование даты в нужный формат YYYY-MM-DD
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // +1, так как месяцы в JavaScript начинаются с 0
    const day = ('0' + now.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;

    const sale = [
      formattedDate,
      phone,
      email,
      `https://azatvaleev.getcourse.ru/sales/control/deal/update/id/${id}`,
    ];

    // Преобразуем vkType в range
    const range = this.rangeMappings[type];
    if (!range) {
      throw new Error(`Invalid type: ${type}`);
    }

    // Если массив для текущего range еще не существует, создаем его
    if (!this.salesByDealName[range]) {
      this.salesByDealName[range] = [];
    }

    console.log(sale);
    this.salesByDealName[range].push(sale);

    return 'Data added for dealName: ' + range;
  }

  @Cron('0 7,13 * * *')
  @Get('cron')
  async postToGoogleApi() {
    // Итерируемся по всем range в объекте salesByDealName
    for (const range in this.salesByDealName) {
      console.log(range);
      if (this.salesByDealName.hasOwnProperty(range)) {
        const values = this.salesByDealName[range];
        await this.googleapisService.create(values, range);
        // После отправки данных можно очистить массив для текущего range
        delete this.salesByDealName[range];
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
