package com.finli.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAdminDTO {
    private Integer id;
    private String name;             // El JS espera "name"
    private String email;            // El JS espera "email"
    private String subscriptionType; // El JS espera "subscriptionType"
    private String registrationDate; // El JS espera "registrationDate"
    private String photo;            // El JS espera "photo"
}