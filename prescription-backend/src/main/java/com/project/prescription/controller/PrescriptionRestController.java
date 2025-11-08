package com.project.prescription.controller;

import com.project.prescription.dto.PrescriptionDTO;
import com.project.prescription.entity.User;
import com.project.prescription.service.PrescriptionService;
import com.project.prescription.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/prescription")
@Tag(name = "Prescription Management", description = "APIs for managing medical prescriptions")
@SecurityRequirement(name = "bearerAuth")
public class PrescriptionRestController {

    private final PrescriptionService prescriptionService;
    private final UserService userService;

    @Autowired
    public PrescriptionRestController(PrescriptionService prescriptionService, UserService userService) {
        this.prescriptionService = prescriptionService;
        this.userService = userService;
    }

    private User getCurrentUser(Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userService.findByUsername(username);
    }

    @GetMapping
    public ResponseEntity<?> getPrescriptions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        
        if (startDate == null || endDate == null) {
            LocalDate now = LocalDate.now();
            startDate = now.withDayOfMonth(1);
            endDate = now.withDayOfMonth(now.lengthOfMonth());
        }
        
        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsByDateRange(
                currentUser, startDate, endDate);
        
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPrescription(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            PrescriptionDTO prescription = prescriptionService.getPrescriptionById(id, currentUser);
            return ResponseEntity.ok(prescription);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPrescription(
            @Valid @RequestBody PrescriptionDTO prescriptionDTO,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            PrescriptionDTO createdPrescription = prescriptionService.createPrescription(prescriptionDTO, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPrescription);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionDTO prescriptionDTO,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            prescriptionDTO.setId(id);
            PrescriptionDTO updatedPrescription = prescriptionService.updatePrescription(id, prescriptionDTO, currentUser);
            return ResponseEntity.ok(updatedPrescription);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a prescription", description = "Deletes a prescription entry")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Prescription deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Prescription not found")
    })
    public ResponseEntity<?> deletePrescription(
            @Parameter(description = "Prescription ID") @PathVariable Long id,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            prescriptionService.deletePrescription(id, currentUser);
            Map<String, String> message = new HashMap<>();
            message.put("message", "Prescription deleted successfully");
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}

