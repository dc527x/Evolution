/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dc527x.Evolution.repositories;

import dc527x.Evolution.dtos.UserPictures;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author diego
 */
@Repository
public interface UserPicturesRepository extends JpaRepository<UserPictures, Integer>{
    
    List<UserPictures> findByUserUserId(Integer userId);    
}
