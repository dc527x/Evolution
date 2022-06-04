/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dc527x.Evolution.repositories;

import dc527x.Evolution.dtos.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author diego
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
    
    Optional<User> findByUsername(String username);
}