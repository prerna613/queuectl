#!/usr/bin/env node

const runMigration = require('./database/migrate');
const JobRepository = require('./repositories/JobRepository');
const ConfigService = require('./config/ConfigService');

runMigration();

const now = new Date().toISOString();

if (!JobRepository.findById('demo-job')) {
  JobRepository.create({
    id: 'demo-job',
    command: 'echo Hello QueueCTL',
    state: 'pending',
    attempts: 0,
    max_retries: ConfigService.getNumber('max_retries'),
    next_retry_at: null,
    worker_id: null,
    locked: 0,
    created_at: now,
    updated_at: now,
  });
}

console.log('\nJobs');
console.table(JobRepository.findAll());

console.log('\nConfiguration');
console.table(ConfigService.getAll());