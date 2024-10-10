package com.baranbasaran.cheaperbook.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AddressDto {
    private String street;
    private String city;
    private String country;
    private String postalCode;
}