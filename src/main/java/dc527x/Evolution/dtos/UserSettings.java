/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dc527x.Evolution.dtos;

import javax.persistence.Column;
import javax.persistence.Entity;
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
public class UserSettings {

    @Id
    private int userIdSettings;

    @Column
    private int mutationRate;

    @Column
    private int populationSize;

    @Column
    private int chromosomes;

    @Column
    private int vertices;

    @Column
    private int selection;

//    @OneToOne
//    @MapsId
//    @ManyToOne
//    @JoinColumn(name = "user_Id")
//    private User user;
}
