Guía de Implementación de un Entorno DevOps en AWS (Frontend + Backend)

Este README describe cómo levantar un entorno de desarrollo completo utilizando AWS. Se despliegan dos aplicaciones (frontend en React y backend en Node.js) con integración y entrega continua desde GitHub hasta ECS con Fargate, utilizando servicios como ECR, ALB, CodeBuild y CodePipeline.


🗂 Estructura del Proyecto

/devops-demo-app
├── backend
│   ├── Dockerfile
│   └── index.js
├── frontend
│   ├── Dockerfile
│   └── src/App.jsx
├── buildspec-backend.yml
└── buildspec-frontend.yml


🐳 1. Amazon ECR (Elastic Container Registry)

Crear dos repositorios:

frontend-app
backend-app

🏗 2. CodeBuild

Crear 2 proyectos (frontend y backend)

Sistema operativo: Ubuntu con soporte Docker

Conceder privilegios para usar Docker

📄 buildspec-frontend.yml

version: 0.2
phases:
  pre_build:
    commands:
      - aws ecr get-login-password | docker login --username AWS --password-stdin <ECR_URL>
  build:
    commands:
      - docker build -t frontend-app ./frontend
      - docker tag frontend-app:latest <ECR_URL>/frontend-app:latest
  post_build:
    commands:
      - docker push <ECR_URL>/frontend-app:latest
      - echo '[{"name":"frontend-app","imageUri":"<ECR_URL>/frontend-app:latest"}]' > imagedefinitions.json
artifacts:
  files:
    - imagedefinitions.json

(Similar para el backend con ruta y nombre de imagen respectivos)

🚀 3. CodePipeline

Crear 2 pipelines (frontend y backend)

Fuente: GitHub (via CodeStar Connection)
Build: Proyecto CodeBuild
Deploy: Amazon ECS con imagedefinitions.json como artefacto

⚙️ 4. Amazon ECS con Fargate

📦 Crear un cluster ECS

Tipo: Fargate

📄 Crear definiciones de tarea

Una para cada servicio

Configurar:

Nombre de contenedor

Imagen desde ECR

Puerto expuesto (3000 backend, 80 frontend)

Memoria y CPU (mínimos para desarrollo)

🧩 Crear servicios ECS

Asociar a cluster y definición de tarea

Asociar cada uno a su Target Group

🌐 5. Application Load Balancer (ALB)

Crear ALB público

Listeners: puerto 80

Target groups:

tg-frontend: puerto 80
tg-backend: puerto 3000

⚖️ Reglas del listener

/api/* → tg-backend

/ → tg-frontend

🔐 6. Grupos de Seguridad

ALB

Inbound: puerto 80 desde 0.0.0.0/0

Servicios ECS

Backend: permite puerto 3000 desde SG del ALB

Frontend: permite puerto 80 desde SG del ALB

✅ 7. Validación

Ver frontend: http://<ALB-DNS>

Ver backend: http://<ALB-DNS>/api

💰 8. Costos y Recomendaciones

Fargate

Cobra por CPU y memoria por segundo

Para pruebas: usar mínimas especificaciones

ALB

Cobra por hora + tráfico (LCU)

Recomendaciones

Apagar servicios cuando no se usen

Usar infraestructura como código para reconstrucción rápida

📌 Futuro

Monitoreo: CloudWatch, X-Ray

Infraestructura como código: Terraform / CloudFormation

CI/CD más avanzada: Staging, Testing
