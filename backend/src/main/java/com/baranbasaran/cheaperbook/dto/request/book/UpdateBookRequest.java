package com.baranbasaran.cheaperbook.dto.request.book;

import com.baranbasaran.cheaperbook.enums.Status;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateBookRequest {
    @DecimalMin(value = "0.0", message = "Price must be greater than 0")
    private BigDecimal price;
    private Status status;
}
