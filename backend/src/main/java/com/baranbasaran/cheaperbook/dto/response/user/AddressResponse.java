package com.baranbasaran.cheaperbook.dto.response.user;

import com.baranbasaran.cheaperbook.model.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private String street;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String additionalInfo;

    public static AddressResponse from(Address address) {
        return AddressResponse.builder()
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .additionalInfo(address.getAdditionalInfo())
                .build();
    }
} 