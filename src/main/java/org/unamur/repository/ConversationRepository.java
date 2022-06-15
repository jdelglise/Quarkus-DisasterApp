package org.unamur.repository;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import org.unamur.entity.ConversationEntity;

import javax.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * See https://quarkus.io/guides/mongodb-panache - option 2
 */

@ApplicationScoped
public class ConversationRepository implements PanacheMongoRepository<ConversationEntity> {
    // put your custom logic here as instance methods
    public List<ConversationEntity> findByUserLogin(String login) {
        return find("sender = ?1 or receiver = ?1", login).list(); 
    }

    public Optional<ConversationEntity> findByUsersOptional(String login1, String login2) {
        Optional<ConversationEntity> response;
        response = find("sender = ?1 and receiver = ?2", login1, login2).firstResultOptional();
        if (response.isEmpty()) { // check the opposite scenario (switch sender / receiver)
            response = find("sender = ?1 and receiver = ?2", login2, login1).firstResultOptional();
        }
        return response;
    }
}