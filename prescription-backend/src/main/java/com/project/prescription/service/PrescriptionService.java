package com.project.prescription.service;

import com.project.prescription.dto.PrescriptionDTO;
import com.project.prescription.entity.Prescription;
import com.project.prescription.entity.User;
import com.project.prescription.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public List<PrescriptionDTO> getAllPrescriptions(User user) {
        List<Prescription> prescriptions = prescriptionRepository.findByUser(user);
        return prescriptions.stream()
                .map(PrescriptionDTO::new)
                .collect(Collectors.toList());
    }

    public List<PrescriptionDTO> getPrescriptionsByDateRange(User user, LocalDate startDate, LocalDate endDate) {
        List<Prescription> prescriptions = prescriptionRepository.findByUserAndPrescriptionDateBetween(user, startDate, endDate);
        return prescriptions.stream()
                .map(PrescriptionDTO::new)
                .collect(Collectors.toList());
    }

    public PrescriptionDTO getPrescriptionById(Long id, User user) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        if (prescription.getUser() == null || !prescription.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Prescription does not belong to user");
        }
        
        return new PrescriptionDTO(prescription);
    }

    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO, User user) {
        Prescription prescription = prescriptionDTO.toEntity();
        prescription.setUser(user);
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return new PrescriptionDTO(savedPrescription);
    }

    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO, User user) {
        Prescription existingPrescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        if (!existingPrescription.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Prescription does not belong to user");
        }
        
        existingPrescription.setPrescriptionDate(prescriptionDTO.getPrescriptionDate());
        existingPrescription.setPatientName(prescriptionDTO.getPatientName());
        existingPrescription.setPatientAge(prescriptionDTO.getPatientAge());
        existingPrescription.setPatientGender(prescriptionDTO.getPatientGender());
        existingPrescription.setDiagnosis(prescriptionDTO.getDiagnosis());
        existingPrescription.setMedicines(prescriptionDTO.getMedicines());
        existingPrescription.setNextVisitDate(prescriptionDTO.getNextVisitDate());
        
        Prescription updatedPrescription = prescriptionRepository.save(existingPrescription);
        return new PrescriptionDTO(updatedPrescription);
    }

    public void deletePrescription(Long id, User user) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        if (prescription.getUser() == null || !prescription.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Prescription does not belong to user");
        }
        
        prescriptionRepository.delete(prescription);
    }

    public List<Object[]> getDayWisePrescriptionCount(User user, LocalDate startDate, LocalDate endDate) {
        return prescriptionRepository.countPrescriptionsByDate(user, startDate, endDate);
    }
}

