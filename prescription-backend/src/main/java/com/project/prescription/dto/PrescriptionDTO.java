package com.project.prescription.dto;

import com.project.prescription.entity.Prescription;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Schema(description = "Prescription data transfer object")
public class PrescriptionDTO {

    @Schema(description = "Prescription ID", example = "1")
    private Long id;

    @Schema(description = "Date of prescription", example = "2025-01-15")
    @NotNull(message = "Prescription date is mandatory")
    @PastOrPresent(message = "Prescription date cannot be in the future")
    private LocalDate prescriptionDate;

    @Schema(description = "Patient name", example = "John Doe")
    @NotBlank(message = "Patient name is mandatory")
    @Size(min = 1, max = 255, message = "Patient name must be between 1 and 255 characters")
    private String patientName;

    @Schema(description = "Patient age", example = "35")
    @NotNull(message = "Patient age is mandatory")
    @Min(value = 0, message = "Age must be 0 or greater")
    @Max(value = 150, message = "Age must be 150 or less")
    private Integer patientAge;

    @Schema(description = "Patient gender", example = "MALE")
    @NotNull(message = "Patient gender is mandatory")
    private Prescription.Gender patientGender;

    private String diagnosis;

    private String medicines;

    @Future(message = "Next visit date must be in the future")
    private LocalDate nextVisitDate;

    public PrescriptionDTO() {
    }

    public PrescriptionDTO(Prescription prescription) {
        this.id = prescription.getId();
        this.prescriptionDate = prescription.getPrescriptionDate();
        this.patientName = prescription.getPatientName();
        this.patientAge = prescription.getPatientAge();
        this.patientGender = prescription.getPatientGender();
        this.diagnosis = prescription.getDiagnosis();
        this.medicines = prescription.getMedicines();
        this.nextVisitDate = prescription.getNextVisitDate();
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getPrescriptionDate() {
        return prescriptionDate;
    }

    public void setPrescriptionDate(LocalDate prescriptionDate) {
        this.prescriptionDate = prescriptionDate;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Integer getPatientAge() {
        return patientAge;
    }

    public void setPatientAge(Integer patientAge) {
        this.patientAge = patientAge;
    }

    public Prescription.Gender getPatientGender() {
        return patientGender;
    }

    public void setPatientGender(Prescription.Gender patientGender) {
        this.patientGender = patientGender;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getMedicines() {
        return medicines;
    }

    public void setMedicines(String medicines) {
        this.medicines = medicines;
    }

    public LocalDate getNextVisitDate() {
        return nextVisitDate;
    }

    public void setNextVisitDate(LocalDate nextVisitDate) {
        this.nextVisitDate = nextVisitDate;
    }

    public Prescription toEntity() {
        Prescription prescription = new Prescription();
        prescription.setId(this.id);
        prescription.setPrescriptionDate(this.prescriptionDate);
        prescription.setPatientName(this.patientName);
        prescription.setPatientAge(this.patientAge);
        prescription.setPatientGender(this.patientGender);
        prescription.setDiagnosis(this.diagnosis);
        prescription.setMedicines(this.medicines);
        prescription.setNextVisitDate(this.nextVisitDate);
        return prescription;
    }
}

