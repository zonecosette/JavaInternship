package com.knf.dev.demo.crudapplication.service;

import com.knf.dev.demo.crudapplication.entity.AuditTrail;
import com.knf.dev.demo.crudapplication.repository.AuditTrailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditTrailService {

    @Autowired
    private AuditTrailRepository auditTrailRepository;

    public void logAction(String action, String entity, String entityId, String username, String details) {
        AuditTrail auditTrail = new AuditTrail();
        auditTrail.setAction(action);
        auditTrail.setEntity(entity);
        auditTrail.setEntityId(entityId);
        auditTrail.setUsername(username);
        auditTrail.setTimestamp(LocalDateTime.now());
        auditTrail.setDetails(details);
        auditTrailRepository.save(auditTrail);
    }
}
