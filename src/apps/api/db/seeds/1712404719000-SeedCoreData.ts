import { AppDataSource } from '../data-source';
import { User } from '../../src/users/users.model';
import { UserRole } from '../../src/users/constants';
import { ClinicianProfile } from '../../src/users/clinician-profile.model';
import { Tenant } from '../../src/tenants/tenants.model';
import { Practice } from '../../src/practices/practices.model';
import { Child, GrowthRecord, CompletedMilestone, CompletedVaccination, Allergy, MedicalCondition } from '../../src/children/children.model';
import { Report, ReportType } from '../../src/reports/reports.model';
import { Appointment, AppointmentStatus } from '../../src/appointments/appointments.model';
import { ResourceStatus } from '../../src/common/enums';

/**
 * Seed script for the core data (Tenants, Practices, Users, Children).
 */
async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('🌱 Starting seed...');

  const userRepo = AppDataSource.getRepository(User);
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const practiceRepo = AppDataSource.getRepository(Practice);
  const childRepo = AppDataSource.getRepository(Child);
  const clinicianProfileRepo = AppDataSource.getRepository(ClinicianProfile);
  const reportRepo = AppDataSource.getRepository(Report);
  const appointmentRepo = AppDataSource.getRepository(Appointment);
  const allergyRepo = AppDataSource.getRepository(Allergy);
  const conditionRepo = AppDataSource.getRepository(MedicalCondition);

  // 1. Seed Tenant
  let tenant = await tenantRepo.findOne({ where: { email: 'contact@raisingatlantic.com' } });
  if (!tenant) {
    tenant = tenantRepo.create({
      name: 'Raising Atlantic Health',
      email: 'contact@raisingatlantic.com',
      phone: '(021) 555-0123',
      website: 'https://raisingatlantic.com',
      status: ResourceStatus.ACTIVE,
    });
    tenant = await tenantRepo.save(tenant);
    console.log('✅ Seeded Tenant');
  }

  // 2. Seed Practice
  let practice = await practiceRepo.findOne({ where: { name: 'Atlantic Cape Town Clinic' }, relations: ['clinicians'] });
  if (!practice) {
    practice = practiceRepo.create({
      tenant,
      name: 'Atlantic Cape Town Clinic',
      address: '123 Main St, Cape Town',
      city: 'Cape Town',
      state: 'Western Cape',
      zip: '8001',
      phone: '(021) 555-9876',
      status: ResourceStatus.ACTIVE,
      clinicians: [],
    });
    practice = await practiceRepo.save(practice);
    console.log('✅ Seeded Practice');
  }

  // 3. Seed Clinician User & Profile
  let clinician = await userRepo.findOne({ where: { email: 'dr.smith@clinician.com' } });
  if (!clinician) {
    clinician = userRepo.create({
      title: 'Dr.',
      name: 'John Smith',
      email: 'dr.smith@clinician.com',
      phone: '(021) 987-6543',
      role: UserRole.CLINICIAN,
    });
    clinician = await userRepo.save(clinician);

    const profile = clinicianProfileRepo.create({
      user: clinician,
      specialty: 'Pediatrician',
      bio: 'Expert in early childhood development with over 15 years of experience.',
    });
    await clinicianProfileRepo.save(profile);

    // Link clinician to practice
    practice.clinicians = [profile];
    await practiceRepo.save(practice);
    console.log('✅ Seeded Clinician User & Profile');
  }

  // 4. Seed Parent User (Doe Family)
  let parent = await userRepo.findOne({ where: { email: 'jane.doe@example.com' } });
  if (!parent) {
    parent = userRepo.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '(021) 123-4567',
      role: UserRole.PARENT,
    });
    parent = await userRepo.save(parent);
    console.log('✅ Seeded Parent User (Jane Doe)');
  }

  // 4b. Seed Admin Users
  let admin = await userRepo.findOne({ where: { email: 'admin@raisingatlantic.com' } });
  if (!admin) {
    admin = userRepo.create({
      name: 'Admin User',
      email: 'admin@raisingatlantic.com',
      phone: '(021) 555-5555',
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('✅ Seeded Admin User');
  }


  let superAdmin = await userRepo.findOne({ where: { email: 'super@raisingatlantic.com' } });
  if (!superAdmin) {
    superAdmin = userRepo.create({
      name: 'Super Admin',
      email: 'super@raisingatlantic.com',
      phone: '(021) 000-0000',
      role: UserRole.SUPER_ADMIN,
    });
    await userRepo.save(superAdmin);
    console.log('✅ Seeded Super Admin User');
  }

  // 5. Seed Child (Alex Doe)
  let child = await childRepo.findOne({ where: { firstName: 'Alex', lastName: 'Doe' } });
  if (!child) {
    child = childRepo.create({
      parent,
      clinician,
      name: 'Alex Doe',
      firstName: 'Alex',
      lastName: 'Doe',
      gender: 'male',
      dateOfBirth: new Date('2024-02-15'),
      status: ResourceStatus.ACTIVE,
      notes: 'Loves babbling and trying to sit up. Very curious about toys that make noise.',
      progress: 20,
    });
    child = await childRepo.save(child);
  }

  // Clear existing sub-records for this child to ensure clean state for verification counts
  const growthRepo = AppDataSource.getRepository(GrowthRecord);
  const milestoneRepo = AppDataSource.getRepository(CompletedMilestone);
  const vaccineRepo = AppDataSource.getRepository(CompletedVaccination);

  await growthRepo.delete({ child: { id: child.id } });
  await milestoneRepo.delete({ child: { id: child.id } });
  await vaccineRepo.delete({ child: { id: child.id } });

  // 6. Growth Records (4 records, 1 pending)
  const growthSeeds = [
    { child, date: new Date('2024-02-15'), height: '50cm', weight: '3.3kg', notes: 'Birth measurements.' },
    { child, date: new Date('2024-04-15'), height: '58cm', weight: '5.6kg', notes: '2-month check-up.' },
    { child, date: new Date('2024-06-15'), height: '64cm', weight: '7.0kg', notes: '4-month check-up.' },
    { 
      child, 
      date: new Date('2024-08-15'), height: '68cm', weight: '7.9kg', notes: '6-month check-up.', 
      status: ResourceStatus.PENDING_ASSESSMENT 
    },
  ];
  await growthRepo.save(growthSeeds);

  // 7. Completed Milestones (4 records, 1 pending)
  const milestoneSeeds = [
    { child, milestoneId: 'm_2mo_soc_1', dateAchieved: new Date('2024-04-10') },
    { child, milestoneId: 'm_2mo_lan_1', dateAchieved: new Date('2024-04-12') },
    { child, milestoneId: 'm_4mo_mot_1', dateAchieved: new Date('2024-06-15'), notes: 'Loves rolling around during tummy time.' },
    { 
      child, 
      milestoneId: 'm_6mo_lan_1', dateAchieved: new Date('2024-08-18'), 
      status: ResourceStatus.PENDING_ASSESSMENT
    },
  ];
  await milestoneRepo.save(milestoneSeeds);

  // 8. Completed Vaccinations (4 records, 1 pending)
  const vaccineSeeds = [
    { child, vaccineId: 'hepB1', dateAdministered: new Date('2024-02-15') },
    { child, vaccineId: 'hepB2', dateAdministered: new Date('2024-04-15') },
    { child, vaccineId: 'rv1', dateAdministered: new Date('2024-04-15') },
    { 
      child, 
      vaccineId: 'dtap1', dateAdministered: new Date('2024-04-15'),
      status: ResourceStatus.PENDING_ASSESSMENT 
    },
  ];
  await vaccineRepo.save(vaccineSeeds);

  // 9. New Entities Data for Alex Doe
  await allergyRepo.delete({ child: { id: child.id } });
  await conditionRepo.delete({ child: { id: child.id } });
  await reportRepo.delete({ child: { id: child.id } });
  await appointmentRepo.delete({ child: { id: child.id } });

  await allergyRepo.save([
    { child, allergen: 'Peanuts', severity: 'severe', notes: 'Requires EpiPen' },
    { child, allergen: 'Dust', severity: 'mild' }
  ]);

  await conditionRepo.save([
    { child, conditionName: 'Eczema', diagnosisDate: new Date('2024-03-01'), status: ResourceStatus.ACTIVE }
  ]);

  await appointmentRepo.save([
    { 
      child, 
      clinician, 
      practice, 
      scheduledAt: new Date(Date.now() + 86400000 * 7), // 7 days from now
      status: AppointmentStatus.SCHEDULED,
      notes: '9-month wellness checkup'
    }
  ]);

  await reportRepo.save([
    {
      child,
      type: ReportType.CRECHE_ADMISSION,
      status: ResourceStatus.ACTIVE,
      generatedBy: clinician,
      content: { summary: 'Alex is fit for creche admission with clear immunization record.' }
    }
  ]);

  console.log('✅ Seeded new entities (Allergies, Conditions, Appointments, Reports)');
  console.log('✅ Seeded/Updated Child (Alex Doe) and sub-data (including 3 for verification)');
  console.log('🏁 Seed completed successfully.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
