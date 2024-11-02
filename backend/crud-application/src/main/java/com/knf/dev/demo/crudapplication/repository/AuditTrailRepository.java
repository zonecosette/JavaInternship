package com.knf.dev.demo.crudapplication.repository;

import com.knf.dev.demo.crudapplication.entity.AuditTrail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditTrailRepository  extends JpaRepository<AuditTrail, Long> {
}
