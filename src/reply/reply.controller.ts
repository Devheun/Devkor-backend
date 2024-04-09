import { Body, Controller, Delete, NotFoundException, Param, ParseIntPipe, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ReplyService } from './reply.service';

@Controller('reply')
@UseGuards(AuthGuard())
export class ReplyController {
    constructor(private replyService : ReplyService){}

    @Post('/:commentsId')
    async createReply(
        @Param('commentsId',ParseIntPipe) commentsId: number,
        @GetUser() user : User,
        @Body(ValidationPipe) reply : string,
    ) : Promise<Object>{
        try{
            const response = await this.replyService.createReply(commentsId, user, reply['content']);
            return {
                content:response['replys'].content,
                createdAt:response['replys'].createdAt,
                nickname:response['nickname'],
            };
        }catch(error){
            console.error(error);
            throw new NotFoundException('Comment not found!');
        }
    }

    @Delete('cancel/:replyId')
    async cancelReply(
        @Param('replyId',ParseIntPipe) replyId: number,
        @GetUser() user : User,
    ): Promise<any> {
        try{
            await this.replyService.deleteReply(replyId, user);
            return{
                message: 'Reply deleted!',
            };
        }catch(error){
            console.error(error);
            throw new NotFoundException('Reply not found!');
        }
    }
}
