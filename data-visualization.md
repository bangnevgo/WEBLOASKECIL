# Data Visualization for WEBLOASKECIL Platform

## Platform Overview
This is a comprehensive learning platform focused on Neville Goddard's teachings with 10 Parts and 49 Lessons.

## Current Database Schema

```mermaid
graph TD
    A[User] --> B[Completion]
    A --> C[ActivationCode]
    C --> A[User]
    
    style A fill:#e3f2fd,stroke:#2196f3
    style B fill:#fff3e0,stroke:#ff9800
    style C fill:#f3e5f5,stroke:#9c27b0
```

## Platform Analytics Dashboard

```mermaid
graph TB
    subgraph "User Analytics"
        U1[Total Users] --> U2[Active Users]
        U2 --> U3[Free Tier]
        U3 --> U4[Pelajar Tier]
        U3 --> U5[Premium Tier]
        U4 --> U3
    end
    
    subgraph "Content Analytics"
        C1[Total Lessons] --> C2[Lessons Completed]
        C1 --> C3[Completion Rate]
        C2 --> U2
    end
    
    subgraph "Revenue Analytics"
        R1[Monthly Revenue] --> R2[Subscription Revenue]
        R2 --> R3[Payment Gateway Status]
    end
    
    U1 -.-> R1
    C2 -.-> R1
    R1 -.-> R3
    
    style U1 fill:#2196f3,color:white
    style U2 fill:#4caf50,color:white
    style R1 fill:#ff9800,color:white
    style C2 fill:#9c27b0,color:white
```

## Student Progress Timeline

```mermaid
graph LR
    P1[Student Onboarding] --> P2[First Lesson]
    P2 --> P3[Daily Practice]
    P3 --> P4[Milestone Achievement]
    P4 --> P5[Community Engagement]
    P5 --> P6[Master Tier]
    
    P2 -.-> C2
    P3 -.-> U2
    P4 -.-> U2
    P5 -.-> R1
    
    style P1 fill:#e8f5e8,stroke:#4caf50
    style P2 fill:#e8f5e8,stroke:#4caf50
    style P3 fill:#e8f5e8,stroke:#4caf50
    style P4 fill:#fff3e0,stroke:#ff9800
    style P5 fill:#fff3e0,stroke:#ff9800
    style P6 fill:#f3e5f5,stroke:#9c27b0
```

## Course Structure Visualization

```mermaid
flowchart LR
    A[Part I - Foundation] --> A1[Lesson 1.1: Introduction]
    A1 --> A2[Lesson 1.2: The Law]
    A1 --> A3[Lesson 1.3: Reality Creation]
    
    B[Part II - Practice] --> B1[Lesson 2.1: Daily Exercise]
    B1 --> B2[Lesson 2.2: Visualization]
    B1 --> B3[Lesson 2.3: Affirmation]
    
    subgraph "Advanced Parts" 
        C[Part III-V] --> C1[Advanced Techniques]
        C1 --> C2[Mastery Level]
    end
    
    A1 -.-> C2
    B1 -.-> C2
    
    style A fill:#ffeb3b,stroke:#fbc02d
    style B fill:#4caf50,color:white
    style C fill:#2196f3,color:white
    style A1 fill:#fff8e1
    style A2 fill:#fff8e1
    style A3 fill:#fff8e1
    style B1 fill:#e8f5e8
    style B2 fill:#e8f5e8
    style B3 fill:#e8f5e8
    style C1 fill:#e3f2fd
    style C2 fill:#e3f2fd
```

## Technology Stack Dependencies

```mermaid
graph TD
    T1[Frontend] --> DB1[PostgreSQL]
    T1 --> T2[Prisma ORM]
    
    T3[Backend] --> DB1
    
    subgraph "Payment Systems"
        P1[Midtrans] --> T3
        P2[NextAuth] --> T1
    end
    
    subgraph "AI Services"
        AI1[AI Hub] --> T1
        AI2[Google APIs] --> AI1
    end
    
    style T1 fill:#2196f3,color:white
    style T2 fill:#4caf50,color:white
    style T3 fill:#ff9800,color:white
    style DB1 fill:#9c27b0,color:white
```

## User Journey Flow

```mermaid
graph TB
    L1[Landing Page] --> L2[Course Discovery]
    L2 --> L3[Enrollment]
    L3 --> L4[Dashboard]
    L4 --> L5[Lesson Progress]
    L5 --> L6[Community]
    L6 --> L7[Master Tier]
    
    style L1 fill:#f5f5f5
    style L2 fill:#f5f5f5
    style L3 fill:#f5f5f5
    style L4 fill:#ffeb3b
    style L5 fill:#4caf50,color:white
    style L6 fill:#2196f3,color:white
    style L7 fill:#9c27b0,color:white
```

## Platform Metrics

| Metric | Current Status | Target |
|--------|---------------|--------|
| Total Users | Growing | 5,000/month |
| Lesson Completion | 35% | 50% |
| Engagement Rate | 60% | 80% |
| Revenue Growth | Stable | 25%/year |
| User Retention | 70% | 85% |

```mermaid
graph TB
    M1[Monthly Active Users] --> M2[Daily Active Users]
    M2 --> M3[Returning Users]
    M3 --> M4[New Users]
    M4 -.-> M1
    
    style M1 fill:#2196f3,color:white
    style M2 fill:#4caf50,color:white
    style M3 fill:#ff9800,color:white
    style M4 fill:#9c27b0,color:white
```

## Deployment Architecture

```mermaid
graph LR
    subgraph "CDN"
        S1[Static Assets]
        S2[Images]
    end
    
    subgraph "API Gateway"
        A1[Edge Functions]
        A2[Revalidation]
    end
    
    subgraph "Application"
        AP1[Next.js App]
        AP2[WebSocket]
    end
    
    subgraph "Database"
        DB1[PostgreSQL]
        DB2[Redis Cache]
    end
    
    S1 --> A1
    S2 --> A1
    A1 --> AP1
    AP1 --> AP2
    AP2 --> DB1
    DB1 --> DB2
    
    style S1 fill:#ffeb3b,stroke:#fbc02d
    style S2 fill:#ffeb3b,stroke:#fbc02d
    style A1 fill:#4caf50,color:white
    style A2 fill:#4caf50,color:white
    style AP1 fill:#2196f3,color:white
    style AP2 fill:#2196f3,color:white
    style DB1 fill:#9c27b0,color:white
    style DB2 fill:#9c27b0,color:white
```
