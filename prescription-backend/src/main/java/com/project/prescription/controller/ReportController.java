package com.project.prescription.controller;

import com.project.prescription.entity.User;
import com.project.prescription.service.PrescriptionService;
import com.project.prescription.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/report")
@Tag(name = "Reports", description = "Prescription reporting and analytics endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final PrescriptionService prescriptionService;
    private final UserService userService;

    @Autowired
    public ReportController(PrescriptionService prescriptionService, UserService userService) {
        this.prescriptionService = prescriptionService;
        this.userService = userService;
    }

    private User getCurrentUser(Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userService.findByUsername(username);
    }

    @GetMapping("/day-wise")
    @Operation(summary = "Get day-wise prescription count",
               description = "Returns the count of prescriptions grouped by day for the specified date range")
    public ResponseEntity<?> getDayWisePrescriptionCount(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        
        if (startDate == null || endDate == null) {
            LocalDate now = LocalDate.now();
            startDate = now.withDayOfMonth(1);
            endDate = now.withDayOfMonth(now.lengthOfMonth());
        }
        
        List<Object[]> dayWiseCounts = prescriptionService.getDayWisePrescriptionCount(
                currentUser, startDate, endDate);
        
        List<Map<String, Object>> report = new ArrayList<>();
        for (Object[] row : dayWiseCounts) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("day", row[0].toString());
            entry.put("prescriptionCount", ((Long) row[1]).intValue());
            report.add(entry);
        }
        
        return ResponseEntity.ok(report);
    }
}

