package org.unamur.resource;

import static org.mockito.ArgumentMatchers.any;

import java.time.LocalDate;
import java.util.Optional;

import javax.inject.Inject;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.openapitools.model.AddressDto;
import org.openapitools.model.LoginDto;
import org.openapitools.model.TokenDto;
import org.openapitools.model.UserDto;
import org.unamur.UserRoles;
import org.unamur.entity.PasswordEntity;
import org.unamur.entity.RefreshTokenEntity;
import org.unamur.entity.UserEntity;
import org.unamur.repository.RefreshTokenRepository;
import org.unamur.repository.UserRepository;
import org.unamur.util.CryptoUtil;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.mockito.InjectMock;

@QuarkusTest
public class AuthResourceTest {

    @InjectMock
    UserRepository userRepository;

    @InjectMock
    RefreshTokenRepository refreshTokenRepository;

    @Inject
    AuthResource AuthResource;

    public void setupMockUser() {
        UserEntity userEntity = userEntityGenerator();
        Mockito.when(userRepository.findByLoginOptional(any())).thenReturn(Optional.of(userEntity));
        // the line above create a mockup where you any call to "userRepository.findByLoginOptional" will return our userEntity
    }

    public final String TEST_USERNAME = "TestUserNameRandom";
    public final String TEST_PASSWORD = "PasswordJust4Test";
    public final String TEST_LASTNAME = "Doe";
    public final String TEST_FIRSTNAME = "John";
    public final String TEST_EMAIL = "john@doe.com";
    public final String TEST_CITY = "Bruxelles";
    public final String TEST_COUNTRY = "Belgium";
    public final String TEST_NUMBER = "15b";
    public final String TEST_POSTCODE = "B-1579";
    public final String TEST_STREET = "rue du test";
    public final String TEST_BIRTHDATE = "1991-09-17";

    @Test
    public void getTokenOkTest() {
        setupMockUser();
        RefreshTokenEntity refreshTokenEntity = tokenRefreshEntityGenerator(userRepository.findByLoginOptional(TEST_USERNAME).get());
        Mockito.when(refreshTokenRepository.findByTokenOptional(any())).thenReturn(Optional.of(refreshTokenEntity));
        LoginDto loginDto = new LoginDto();
        loginDto.setPassword(TEST_PASSWORD);
        loginDto.setUsername(TEST_USERNAME);
        Response response = AuthResource.getToken(loginDto);
        Assertions.assertEquals(200, response.getStatus());
        TokenDto tokenDto = (TokenDto) response.getEntity();
        Assertions.assertNotNull(tokenDto);
    }

    @Test
    public void registerKoTest() {
        setupMockUser();
        UserDto userDto = new UserDto();
        userDto.setLogin(TEST_USERNAME);
        userDto.setPassword(TEST_PASSWORD);
        userDto.setEmail(TEST_EMAIL);
        userDto.setFirstName(TEST_FIRSTNAME);
        userDto.setLastName(TEST_LASTNAME);
        LocalDate birthDate = LocalDate.now();
        userDto.setBirthdate(birthDate);
        AddressDto addressDto = new AddressDto();
        addressDto.setCity(TEST_CITY);
        addressDto.setCountry(TEST_COUNTRY);
        addressDto.setNumber(TEST_NUMBER);
        addressDto.setPostCode(TEST_POSTCODE);
        addressDto.setStreet(TEST_STREET);
        userDto.addAddressListItem(addressDto);
        Response response = AuthResource.register(userDto);
        Assertions.assertEquals(409, response.getStatus());
    }

    @Test
    public void registerOkTest() {
        UserDto userDto = new UserDto();
        userDto.setLogin(TEST_USERNAME);
        userDto.setPassword(TEST_PASSWORD);
        userDto.setEmail(TEST_EMAIL);
        userDto.setFirstName(TEST_FIRSTNAME);
        userDto.setLastName(TEST_LASTNAME);
        LocalDate birthDate = LocalDate.now();
        userDto.setBirthdate(birthDate);
        AddressDto addressDto = new AddressDto();
        addressDto.setCity(TEST_CITY);
        addressDto.setCountry(TEST_COUNTRY);
        addressDto.setNumber(TEST_NUMBER);
        addressDto.setPostCode(TEST_POSTCODE);
        addressDto.setStreet(TEST_STREET);
        userDto.addAddressListItem(addressDto);
        Response response = AuthResource.register(userDto);
        Assertions.assertEquals(201, response.getStatus());
    }

    @Test
    public void refreshTokenOkTest() {
        setupMockUser();
        RefreshTokenEntity refreshTokenEntity = tokenRefreshEntityGenerator(userRepository.findByLoginOptional(TEST_USERNAME).get());
        Mockito.when(refreshTokenRepository.findByTokenOptional(any())).thenReturn(Optional.of(refreshTokenEntity));
        Response response = AuthResource.refresh();
        Assertions.assertEquals(200, response.getStatus());
        TokenDto tokenDto = (TokenDto) response.getEntity();
        Assertions.assertNotNull(tokenDto);
    }

    @Test
    public void revokeTokenOkTest() {
        setupMockUser();
        RefreshTokenEntity refreshTokenEntity = tokenRefreshEntityGenerator(userRepository.findByLoginOptional(TEST_USERNAME).get());
        Mockito.when(refreshTokenRepository.findByTokenOptional(any())).thenReturn(Optional.of(refreshTokenEntity));
        Response response = AuthResource.revoke();
        Assertions.assertEquals(200, response.getStatus());
    }

    @Test
    public void refreshKoTest() {
        setupMockUser();
        RefreshTokenEntity refreshTokenEntity = tokenRefreshEntityGenerator(userRepository.findByLoginOptional(TEST_USERNAME).get());
        refreshTokenRepository.persist(refreshTokenEntity);
        Response response = AuthResource.revoke(); 
        Assertions.assertEquals(200, response.getStatus());
        Response responseRefresh = AuthResource.refresh();
        Assertions.assertEquals(403, responseRefresh.getStatus());
    }

    private UserEntity userEntityGenerator() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(new ObjectId());
        userEntity.setLogin(TEST_USERNAME);
        PasswordEntity password = new PasswordEntity();
        byte[] salt = CryptoUtil.getSalt();
        password.setSalt(salt);
        byte[] hash;
        try {
            hash = CryptoUtil.getHash(TEST_PASSWORD, salt);
            password.setHash(hash);
            userEntity.setPassword(password);
            //userRepository.persist(userEntity);
        } catch (Exception e) {
            e.printStackTrace();
            Assertions.assertTrue(false); // can probably be improved
        } 
        userEntity.setEmail(TEST_EMAIL);
        userEntity.setFirstName(TEST_FIRSTNAME);
        userEntity.setLastName(TEST_LASTNAME);
        userEntity.setRole(UserRoles.USER);
        return userEntity;
    }

    private RefreshTokenEntity tokenRefreshEntityGenerator(UserEntity userEntity) {
        TokenDto tokenDto = AuthResource.generateNewTokens(userEntity);
        RefreshTokenEntity refreshTokenEntity = new RefreshTokenEntity();
        refreshTokenEntity.setId(new ObjectId());
        refreshTokenEntity.setToken(tokenDto.getRefreshToken());
        return refreshTokenEntity;
    }
}
