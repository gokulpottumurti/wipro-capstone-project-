package com.wellness.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WellnessServiceDTO {
    private Long id;
    private String name;
    private String description;
    private Integer duration;
    private Double fee;
}
