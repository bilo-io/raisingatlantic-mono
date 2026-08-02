import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ConversationView,
  MessageView,
  MessagesService,
} from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtVerifiedGuard } from '../common/guards/jwt-verified.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/constants';
import { AuthTokenPayload } from '../common/guards/jwt-auth.guard';

interface AuthedRequest extends Request {
  user?: AuthTokenPayload;
}

// Parent ↔ care-team messaging. Hard-authenticated (JwtVerifiedGuard rejects
// anonymous requests with 401) and participant-scoped in the service: every
// method resolves the conversation set from the caller's own id (req.user.sub),
// never from a client-supplied identity.
@Controller('conversations')
@UseGuards(JwtVerifiedGuard, RolesGuard)
@Roles(
  UserRole.PARENT,
  UserRole.CLINICIAN,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  listConversations(@Req() req: AuthedRequest): Promise<ConversationView[]> {
    return this.messagesService.listConversations(req.user!.sub);
  }

  @Post()
  createConversation(
    @Req() req: AuthedRequest,
    @Body() dto: CreateConversationDto,
  ): Promise<ConversationView> {
    return this.messagesService.createConversation(
      req.user!.sub,
      dto.participantIds,
    );
  }

  @Get(':id/messages')
  getMessages(
    @Req() req: AuthedRequest,
    @Param('id') id: string,
  ): Promise<MessageView[]> {
    return this.messagesService.getMessages(req.user!.sub, id);
  }

  @Post(':id/messages')
  sendMessage(
    @Req() req: AuthedRequest,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ): Promise<MessageView> {
    return this.messagesService.sendMessage(req.user!.sub, id, dto.body);
  }
}
