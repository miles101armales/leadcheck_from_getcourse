import { Injectable } from '@nestjs/common';
import { CreateGoogleapiDto } from './dto/create-googleapi.dto';
import { UpdateGoogleapiDto } from './dto/update-googleapi.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as fs from 'fs';
import { ICredentials } from './entities/credentials.interface';

@Injectable()
export class GoogleapisService {
  client: OAuth2Client;
  spreadsheet_id: any;
  constructor(private readonly configService: ConfigService) {
    try {
      const credentials: ICredentials = JSON.parse(
        fs.readFileSync('credentials.json', 'utf-8'),
      );
      // Аутентификация с использованием учетных данных
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key.replace(/\\n/g, '\n'),
        },
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
        ],
      });
      //Вызов метода инициализации клиента
      this.initializeClient(auth);
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }
  async create(data: any[], range: string) {
    const sheets = google.sheets({ version: 'v4', auth: this.client });
    const values = [data];
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: this.configService.get('spreadsheet_id'),
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: values,
      },
    });
    return response;
  }

  findAll() {
    return `This action returns all googleapis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} googleapi`;
  }

  update(id: number, updateGoogleapiDto: UpdateGoogleapiDto) {
    return `This action updates a #${id} googleapi`;
  }

  remove(id: number) {
    return `This action removes a #${id} googleapi`;
  }

  async initializeClient(auth: any): Promise<void> {
    try {
      this.client = await auth.getClient();
    } catch (error) {
      console.error('Произошла ошибка при инициализации клиента:', error);
    }
  }
}
