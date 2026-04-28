package com.paperpay.repository;

import com.paperpay.entity.FraudAlert;
import com.paperpay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
    List<FraudAlert> findByUserOrderByCreatedAtDesc(User user);
    List<FraudAlert> findAllByOrderByCreatedAtDesc();
    List<FraudAlert> findByUserAndStatus(User user, FraudAlert.AlertStatus status);
    long countByStatus(FraudAlert.AlertStatus status);
}
