package com.project.prescription.repository;

import com.project.prescription.entity.Prescription;
import com.project.prescription.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    List<Prescription> findByUser(User user);
    
    List<Prescription> findByPrescriptionDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Prescription> findByUserAndPrescriptionDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT p.prescriptionDate, COUNT(p) FROM Prescription p WHERE p.user = :user AND p.prescriptionDate BETWEEN :startDate AND :endDate GROUP BY p.prescriptionDate")
    List<Object[]> countPrescriptionsByDate(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

