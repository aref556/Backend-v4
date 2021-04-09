import { Get, Controller, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    root() {
        return {
            Message: 'Hello Node js web api'
        }
    }
}
