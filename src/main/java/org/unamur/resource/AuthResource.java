package org.unamur.resource;

import java.net.URI;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.openapitools.api.AuthApi;
import org.openapitools.model.AddressDto;
import org.openapitools.model.LoginDto;
import org.openapitools.model.TokenDto;
import org.openapitools.model.UserDto;
import org.unamur.UserRoles;
import org.unamur.configuration.SecurityConfig;
import org.unamur.entity.AddressEntity;
import org.unamur.entity.PasswordEntity;
import org.unamur.entity.RefreshTokenEntity;
import org.unamur.entity.UserEntity;
import org.unamur.entity.UserPreferencesEntity;
import org.unamur.mapper.IAddressMapper;
import org.unamur.mapper.IUserMapper;
import org.unamur.repository.RefreshTokenRepository;
import org.unamur.repository.UserRepository;
import org.unamur.service.IJWTService;
import org.unamur.util.CryptoUtil;

import io.quarkus.logging.Log;

public class AuthResource implements AuthApi {

    @Inject
    IUserMapper userMapper;

    @Inject
    IAddressMapper addressMapper;

    @Inject
    UserRepository userRepository;

    @Inject
    RefreshTokenRepository refreshTokenRepository;

    @Inject
    IJWTService jwtService;

    @Inject
    SecurityConfig securityConfig;

    @Inject
    JsonWebToken jwt;

    @Override
    public Response getToken(@Valid @NotNull LoginDto loginDto) {
        Optional<UserEntity> user = userRepository.findByLoginOptional(loginDto.getUsername());

        if (user.isEmpty()) {
            return Response.status(404).build();
        }

        try {
            if (!Arrays.equals(
                    CryptoUtil.getHash(loginDto.getPassword(), user.get().getPassword().getSalt()),
                    user.get().getPassword().getHash())) {
                return Response.status(401).build();
            }
        } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
            e.printStackTrace();
            return Response.serverError().build();
        }

        user.get().setLastConnection(Calendar.getInstance().getTime());
        userRepository.update(user.get());
        TokenDto tokenDto = generateNewTokens(user.get());
        return Response.ok(tokenDto).build();
    }

    @Override
    public Response register(@Valid @NotNull UserDto userDto) {
        
        UserEntity userEntity = userMapper.toEntity(userDto);
        Optional<UserEntity> user = userRepository.findByLoginOptional(userEntity.getLogin());
        if (user.isPresent()) {
            Log.warn("Someone tried to create an existing user :" + user.get().getLogin());
            return Response.status(409).build();
        }
        userEntity.setId(new ObjectId());
        userEntity.setRole(UserRoles.USER);

        List<AddressEntity> addressList = new ArrayList<AddressEntity>();
        for(AddressDto addressDto : userDto.getAddressList())
        {
            // map Addresses
            AddressEntity addressEntity = addressMapper.toEntity(addressDto);
            addressEntity.setId(new ObjectId());
            addressList.add(addressEntity);
        }
        userEntity.setAddressList(addressList);

        // Generate default preferences, by default everything is private
        UserPreferencesEntity userPreferences = new UserPreferencesEntity();
        userPreferences.setId(new ObjectId());
        userPreferences.setPublicAddresses(false);
        userPreferences.setPublicBirthdate(false);
        userPreferences.setPublicEmail(false);
        userPreferences.setPublicFirstName(false);
        userPreferences.setPublicLastName(false);
        userPreferences.setPublicPhoneNumber(false);

        userEntity.setPreferences(userPreferences);

        // Generate password hash / salt based on input string
        PasswordEntity passwordEntity = new PasswordEntity();
        byte[] salt = CryptoUtil.getSalt();
        passwordEntity.setSalt(salt);
        byte[] hash;
        try {
            hash = CryptoUtil.getHash(userDto.getPassword(), salt);
            passwordEntity.setHash(hash);
            userEntity.setPassword(passwordEntity);
            userRepository.persist(userEntity);
        } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
            return Response.serverError().build();
        }
        Log.info("New user created :" + userEntity.getLogin());
        return Response.created(URI.create("/user/" + userEntity.getId())).build();
    }

    @PermitAll
    @Override
    public Response refresh() {
        Optional<RefreshTokenEntity> refreshTokenEntity = refreshTokenRepository.findByTokenOptional(jwt.getRawToken());

        if (refreshTokenEntity.isEmpty()) {
            return Response.status(403).build();
        }

        Optional<UserEntity> user = userRepository.findByLoginOptional(jwt.getSubject());
        if (user.isEmpty()) {
            return Response.status(401).build();
        }

        user.get().setLastConnection(Calendar.getInstance().getTime());
        userRepository.update(user.get());

        TokenDto tokenDto = generateNewTokens(user.get());
        refreshTokenRepository.delete(refreshTokenEntity.get());
        return Response.ok(tokenDto).build();
    }

    @PermitAll
    @Override
    public Response revoke() {
        if (jwt == null) {
            return Response.status(401).build();
        }

        Optional<RefreshTokenEntity> refreshTokenEntity = refreshTokenRepository.findByTokenOptional(jwt.getRawToken());
        if (refreshTokenEntity.isPresent()) {
            refreshTokenRepository.delete(refreshTokenEntity.get());
        }
        return Response.ok().build();
    }

    public TokenDto generateNewTokens(UserEntity userEntity) {
        Map<String, Object> claims = new HashMap<>();
        List<String> groups = new ArrayList<>();
        groups.add(userEntity.getRole());
        claims.put("groups", groups);

        TokenDto tokenDto = new TokenDto();
        tokenDto.setExpiresIn(securityConfig.accessToken().timeToLive());
        tokenDto.setTokenType("bearer");
        tokenDto.setAccessToken(jwtService.generateAccessToken(userEntity.getLogin(), claims));
        tokenDto.setRefreshToken(jwtService.generateRefreshToken(userEntity.getLogin()));
        return tokenDto;
    }
}
