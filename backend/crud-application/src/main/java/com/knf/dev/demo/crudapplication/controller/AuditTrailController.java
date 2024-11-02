package com.knf.dev.demo.crudapplication.controller;

import com.knf.dev.demo.crudapplication.entity.AuditTrail;
import com.knf.dev.demo.crudapplication.repository.AuditTrailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AuditTrailController {

    @Autowired
    private AuditTrailRepository auditTrailRepository;

    @GetMapping("/audit-logs")
    public List<AuditTrail> getAuditLogs() {
        return auditTrailRepository.findAll();
    }
}
