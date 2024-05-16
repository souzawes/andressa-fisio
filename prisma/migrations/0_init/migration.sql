-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "patient_id" UUID,
    "type" VARCHAR(255),
    "date" DATE,
    "start_time" TIME(6),
    "end_time" TIME(6),

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "creation_date" DATE,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(14),
    "address" VARCHAR(255),
    "neighborhood" VARCHAR(255),
    "number_house" VARCHAR(10),
    "date_of_birth" DATE NOT NULL,
    "sex" VARCHAR(10),
    "civil_state" VARCHAR(20),
    "job" VARCHAR(255),

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients_classes" (
    "patient_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,

    CONSTRAINT "patients_classes_pkey" PRIMARY KEY ("patient_id","class_id")
);

-- CreateTable
CREATE TABLE "recurring_sessions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "class_id" UUID,
    "start_date" DATE,
    "end_date" DATE,
    "start_time" TIME(6),
    "end_time" TIME(6),
    "recurrence_pattern" VARCHAR(255),
    "recurrence_interval" INTEGER,
    "ocuurence_days_of_week" VARCHAR(255),
    "rrule" VARCHAR(255),

    CONSTRAINT "recurring_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients_classes" ADD CONSTRAINT "patients_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients_classes" ADD CONSTRAINT "patients_classes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recurring_sessions" ADD CONSTRAINT "recurring_sessions_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

