package org.unamur.resource;

import io.quarkus.logging.Log;
import io.quarkus.security.UnauthorizedException;

import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.openapitools.api.MessagingApi;
import org.openapitools.model.ConversationDto;
import org.openapitools.model.ConversationOverviewDto;
import org.openapitools.model.MessageDto;
import org.unamur.entity.ConversationEntity;
import org.unamur.entity.MessageEntity;
import org.unamur.entity.UserEntity;
import org.unamur.mapper.IConversationMapper;
import org.unamur.mapper.IMessageMapper;
import org.unamur.repository.ConversationRepository;
import org.unamur.repository.UserRepository;

public class MessagingResource implements MessagingApi {

    @Inject
    IConversationMapper conversationMapper;

    @Inject
    ConversationRepository conversationRepository;

    @Inject
    IMessageMapper  messageMapper;

    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    @PermitAll
    @Override
    public Response getConversation(String id) {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        Optional<ConversationEntity> optConversation = conversationRepository.findByIdOptional(new ObjectId(id));
        if (optConversation.isEmpty()) {
            Log.warn("Cannot find this conversation");
            throw new NotFoundException("Cannot find this conversation");
        }
        ConversationEntity conversation = optConversation.get();
        ConversationDto convDto = conversationMapper.toDto(conversation);
        if (conversation.getSender().equals(jwt.getSubject())){
            convDto.setCorrespondent(conversation.getReceiver());
        } else {
            convDto.setCorrespondent(conversation.getSender());
        }
        // map all messages
        List<MessageDto> messageDtoList = new ArrayList<MessageDto>();
        for (MessageEntity messageEntity : conversation.getMessages())
        {
            if (!messageEntity.getSender().equals(jwt.getSubject())){ 
                messageEntity.setRead(true); // update the status to "read" once retrieved
            }
            messageDtoList.add(messageMapper.toDto(messageEntity));
        }
        conversationRepository.update(conversation);
        convDto.setMessages(messageDtoList);
        return Response.ok(
            convDto).build();
    }

    @PermitAll
    @Override
    public Response getConversations() {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        List<ConversationEntity> conversationList = conversationRepository.findByUserLogin(jwt.getSubject());
        List<ConversationOverviewDto> response = new ArrayList<ConversationOverviewDto>();
        for(ConversationEntity conversation : conversationList)
        {
            ConversationOverviewDto convDto = new ConversationOverviewDto();
            convDto.setId(conversation.getId().toString());
            if (conversation.getSender().equals(jwt.getSubject())){
                convDto.setCorrespondent(conversation.getReceiver());
            } else {
                convDto.setCorrespondent(conversation.getSender());
            }
            List<MessageEntity> messageList = conversation.getMessages();
            //get last message
            if (messageList.size()>0){
                MessageEntity lastMessage = messageList.get(messageList.size() - 1);
                //set info from last message
                convDto.setLastMessage(messageMapper.toDto(lastMessage));
                convDto.setLastUpdate(messageMapper.toDto(lastMessage).getCreationDate());
                //count unread messages
                int count = 0;
                for (int i = 2; ! lastMessage.isRead() && i <= messageList.size()  ; i++){
                    if (! lastMessage.getSender().equals(jwt.getSubject())){
                        count ++;
                    }
                    lastMessage = messageList.get(messageList.size() - i);
                }
                convDto.setUnreadMessages(count);
            }
            response.add(convDto);
        }
        return Response.ok(
            response).build();
    }

    @PermitAll
    @Override
    public Response sendMessageToConversation(String id, @Valid @NotNull MessageDto messageDto) {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        Optional<ConversationEntity> conversation = conversationRepository.findByIdOptional(new ObjectId(id));
        if (conversation.isEmpty()) {
            Log.warn("Cannot find this conversation");
            throw new NotFoundException("Cannot find this conversation");
        }
        // checking if current user is part of this conversation
        if (! conversation.get().getReceiver().equals(jwt.getSubject()) && ! conversation.get().getSender().equals(jwt.getSubject())){
            Log.warn("User " + jwt.getSubject() + " tried to access a conversation he is not part of. Conversation id : " + conversation.get().getId());
            throw new UnauthorizedException("You don't have the right to access this conversation");
        }
        MessageEntity newMessage = toMessageEntity(messageDto);
        conversation.get().getMessages().add(newMessage);
        conversationRepository.update(conversation.get());
        return Response.created(URI.create("/messaging/conversation/" + conversation.get().getId())).build();
    }

    @PermitAll
    @Override
    public Response sendMessageToUser(String login, @Valid @NotNull MessageDto messageDto) {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        Optional<UserEntity> optDestUserEntityFromToken = userRepository.findByLoginOptional(login);
        if (optDestUserEntityFromToken.isEmpty()) {
            Log.warn("User tried to send message to a unknown user");
            throw new NotFoundException("User tried to send message to a unknown user");
        }
        Optional<ConversationEntity> conversation = conversationRepository.findByUsersOptional(jwt.getSubject(),login);
        if (conversation.isEmpty()) {
            // create new conversation
            ConversationEntity newConversation = new ConversationEntity();
            newConversation.setCreationDate(new Date());
            newConversation.setId(new ObjectId());
            newConversation.setSender(jwt.getSubject());
            newConversation.setReceiver(login);
            List<MessageEntity> messageList = new ArrayList<MessageEntity>();
            messageList.add(toMessageEntity(messageDto));
            newConversation.setMessages(messageList);
            conversationRepository.persist(newConversation);
            return Response.created(URI.create("/messaging/conversation/" + newConversation.getId())).build();
        }
        else{
            conversation.get().getMessages().add(toMessageEntity(messageDto));
            conversationRepository.update(conversation.get());
            return Response.created(URI.create("/messaging/conversation/" + conversation.get().getId())).build();
        }
        
        
    }

    public MessageEntity toMessageEntity(MessageDto messageDto){
        MessageEntity newMessage = new MessageEntity();
        newMessage.setCreationDate(new Date());
        newMessage.setSender(jwt.getSubject());
        newMessage.setRead(false);
        newMessage.setMessage(messageDto.getMessage());
        return newMessage;
    }
}