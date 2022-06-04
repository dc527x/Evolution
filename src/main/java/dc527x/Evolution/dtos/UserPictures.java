/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dc527x.Evolution.dtos;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.Data;

/**
 *
 * @author diego
 */
@Entity
@Data
public class UserPictures {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int userIdPictures;
    
    @Column
    private String pictureUrl;
    
    @Column
    private String pictureName;
    
    @Column
    private int year;
    
    @ManyToOne
    @JoinColumn(name = "user_Id")
    private User user;    
}
