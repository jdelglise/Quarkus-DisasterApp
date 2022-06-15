package org.unamur.resource;

import java.net.URI;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.openapitools.api.EntityApi;
import org.openapitools.model.AddressDto;
import org.openapitools.model.EntityDto;
import org.unamur.entity.AddressEntity;
import org.unamur.entity.EntityEntity;
import org.unamur.entity.UserEntity;
import org.unamur.mapper.IAddressMapper;
import org.unamur.mapper.IEntityMapper;
import org.unamur.repository.EntityRepository;
import org.unamur.repository.UserRepository;

import io.quarkus.logging.Log;
import io.quarkus.mongodb.panache.PanacheQuery;

public class EntityResource implements EntityApi {

    @Inject
    IEntityMapper entityMapper;

    @Inject
    EntityRepository entityRepository;

    @Inject
    IAddressMapper addressMapper;

    @Inject
    UserRepository userRepository;

    @Override
    @PermitAll
    public Response getEntities() {
        PanacheQuery<EntityEntity> entities = entityRepository.findAll();
        return Response.ok(
                        entities.stream()
                                .map(entity -> entityMapper.toDto(entity))
                                .toList())
                .build();
    }

    @Override
    @PermitAll
    public Response getEntityById(String id) {
        Optional<EntityEntity> optEntityEntity = entityRepository.findByIdOptional(new ObjectId(id));
        if (optEntityEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Entity with id {0} not found.", id));
        }
        return Response.ok(
                entityMapper.toDto(optEntityEntity.get())).build();
    }

    @Override
    @PermitAll
    public Response registerEntity(@Valid @NotNull EntityDto entityDto) {

        EntityEntity entityEntity = entityMapper.toEntity(entityDto);

        //search for existing entity inside the repository
        Optional<EntityEntity> entity = entityRepository.findByNameOptional(entityEntity.getName());
        if (entity.isPresent()) {
            Log.warn("Someone tried to create an existing entity :" + entity.get().getName());
            return Response.status(409).build();
        }
        entityEntity.setId(new ObjectId());

        //search for registered administrator
        if (entityDto.getAdministrator() != null){
            Optional<UserEntity> administrator = userRepository.findByLoginOptional(entityDto.getAdministrator());
            if (!administrator.isPresent()) {
                Log.warn("The following user doesn't exist in the database :" + entityDto.getAdministrator());
                return Response.status(410).build();
            }
            else {
                entityEntity.setAdministratorId(administrator.get().getId());
            }
        }

        List<AddressEntity> addressList = new ArrayList<AddressEntity>();
        for(AddressDto addressDto : entityDto.getAddressList())
        {
            // map Addresses
            AddressEntity addressEntity = addressMapper.toEntity(addressDto);
            addressEntity.setId(new ObjectId());
            addressList.add(addressEntity);
        }
        entityEntity.setAddressList(addressList);

        /*if (entityDto.getPicture() != null) {
            entityEntity.setPicture(new Binary(BsonBinarySubType.BINARY, Base64.getDecoder().decode(entityDto.getPicture().getBytes(StandardCharsets.UTF_8))));
        }*/

        entityRepository.persist(entityEntity);
        Log.info("New entity created :" + entityEntity.getName());
        return Response.created(URI.create("/entity/" + entityEntity.getId())).build();
    }

}
