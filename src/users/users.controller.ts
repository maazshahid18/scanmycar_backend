import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Put(':id/emergency-contact')
    async updateEmergencyContact(
        @Param('id') id: string,
        @Body('contact') contact: string,
    ) {
        return this.usersService.updateEmergencyContact(Number(id), contact);
    }
}
