---
title: Separate Environments and Private Data Planes
impact: MEDIUM
impactDescription: stops staging from burning production
tags: iac, vpc, environments, cloud
---

## Separate Environments and Private Data Planes

**Impact: MEDIUM (stops staging from burning production)**

Shared credentials between staging and production, and publicly reachable databases, turn lower environments into attack paths. Use separate cloud accounts/projects, private subnets for data stores, and IaC scanners (Checkov, KICS, CIS benchmarks) on Terraform/Kubernetes/Dockerfiles.

**Incorrect (staging app on prod database):**

```text
STAGING_DATABASE_URL=postgres://prod-user:...@prod-db.public/aws
# Postgres security group allows 0.0.0.0/0:5432
```

**Correct (isolated envs, private DB):**

```text
STAGING_DATABASE_URL=postgres://staging-user:@staging-db.internal:5432/app
# DB in private subnet; ingress only from app security group / private service connect
# Separate AWS account or GCP project for prod vs non-prod
```

Treat servers as ephemeral: no SSH snowflake edits; immutable container images without shells in production where practical.

Reference: [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final), [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
