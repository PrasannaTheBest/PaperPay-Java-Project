package com.paperpay.repository;

import com.paperpay.entity.UpiAccount;
import com.paperpay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UpiAccountRepository extends JpaRepository<UpiAccount, Long> {
    Optional<UpiAccount> findByUpiId(String upiId);
    List<UpiAccount> findByUser(User user);
    Optional<UpiAccount> findByUserAndIsPrimaryTrue(User user);
    boolean existsByUpiId(String upiId);
}
