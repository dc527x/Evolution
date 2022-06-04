/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dc527x.Evolution.Controllers;

import dc527x.Evolution.dtos.UserPictures;
import dc527x.Evolution.dtos.UserSettings;
import dc527x.Evolution.repositories.UserPicturesRepository;
import dc527x.Evolution.repositories.UserRepository;
import dc527x.Evolution.repositories.UserSettingsRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

/**
 *
 * @author diego
 */
@Controller
public class HomeController {

    @Autowired
    UserRepository users;

    @Autowired
    UserPicturesRepository userPictures;

    @Autowired
    UserSettingsRepository userSettings;

    @GetMapping({"/", "/home"})
    public String displayHomePage(Model model) {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            users.findByUsername(username).ifPresent(object -> model.addAttribute("user", object));
            users.findByUsername(username).ifPresent(object -> model.addAttribute("userPictures", userPictures.findByUserUserId(object.getUserId())));
        } else {
            String username = principal.toString();
        }
        return "home";
    }

    @PostMapping({"/saveSettings"})
    public String saveSettings(Model model, UserSettings userSetting) {
        userSettings.save(userSetting);
        return "redirect:/";
    }

    @PostMapping({"/savePicture"})
    public String savePicture(Model model, UserPictures userPicture) {
        userPictures.save(userPicture);
        return "redirect:/";
    }

    @GetMapping({"/about"})
    public String displayAboutPage() {
        return "about";
    }

    @GetMapping({"/login"})
    public String displayLoginPage() {
        return "login";
    }
    
    @GetMapping("/deletePicture")
    public String deletePicture(Integer userIdPictures) {
        userPictures.deleteById(userIdPictures);
        return "redirect:/";
    }    
}
