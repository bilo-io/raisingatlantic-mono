import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../../src/users/users.model';
import { UserRole } from '../../src/users/constants';
import { ClinicianProfile } from '../../src/users/clinician-profile.model';
import { Tenant } from '../../src/tenants/tenants.model';
import { Practice } from '../../src/practices/practices.model';
import {
  Child,
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
  Allergy,
  MedicalCondition,
} from '../../src/children/children.model';
import { Report, ReportType } from '../../src/reports/reports.model';
import {
  Appointment,
  AppointmentStatus,
} from '../../src/appointments/appointments.model';
import { BlogPost } from '../../src/blog/blog.model';
import { ResourceStatus } from '../../src/common/enums';

// =====================================================================
// Examples
// =====================================================================
async function seedExamples(ds: DataSource): Promise<void> {
  console.log('🌱 Seeding examples...');
  const repo = ds.getRepository('examples');

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log(
      `  ⚠️  Skipping — examples table already has ${existingCount} row(s).`,
    );
    return;
  }

  await repo.save([
    {
      name: 'First Example',
      description: 'This is the first seeded example record.',
    },
    {
      name: 'Second Example',
      description: 'This is the second seeded example record.',
    },
    { name: 'Third Example', description: null },
  ]);
  console.log('  ✅ Seeded 3 examples.');
}

// =====================================================================
// Hospitals (Tenants + Practices for the Western Cape network)
// =====================================================================
const HOSPITAL_DATA = [
  {
    name: 'Mediclinic Southern Africa',
    telephone: '+27 21 464 5500',
    website: 'https://www.mediclinic.co.za',
    email: 'hospmngrcapet@mediclinic.co.za',
    address: '21 Hof Street, Oranjezicht, Cape Town, 8001',
    geoLocation: { latitude: -33.9334, longitude: 18.4098 },
    logoUrl:
      'https://www.mediclinic.co.za/etc.clientlibs/mc-corporate/clientlibs/clientlib-site/resources/images/logo.svg',
    practices: [
      {
        name: 'Mediclinic Cape Town',
        address: '21 Hof Street, Oranjezicht, Cape Town, 8001',
        geoLocation: { latitude: -33.9334, longitude: 18.4098 },
      },
      {
        name: 'Mediclinic Constantiaberg',
        address: 'Burnham Road, Plumstead, Cape Town, 7800',
        geoLocation: { latitude: -34.0267, longitude: 18.4628 },
      },
      {
        name: 'Mediclinic Panorama',
        address: 'Rothschild Boulevard, Panorama, Cape Town, 7500',
        geoLocation: { latitude: -33.881, longitude: 18.578 },
      },
      {
        name: 'Mediclinic Milnerton',
        address: 'Cnr Racecourse & Koeberg Road, Milnerton, Cape Town, 7441',
        geoLocation: { latitude: -33.868, longitude: 18.502 },
      },
      {
        name: 'Mediclinic Louis Leipoldt',
        address: 'Broadway, Bellville, Cape Town, 7530',
        geoLocation: { latitude: -33.902, longitude: 18.629 },
      },
      {
        name: 'Mediclinic Durbanville',
        address: '45 Wellington Road, Durbanville, Cape Town, 7550',
        geoLocation: { latitude: -33.832, longitude: 18.647 },
      },
      {
        name: 'Mediclinic Cape Gate',
        address: 'Cnr Okavango and Tanner Roads, Brackenfell, Cape Town, 7560',
        geoLocation: { latitude: -33.843, longitude: 18.694 },
      },
    ],
  },
  {
    name: 'Netcare',
    telephone: '+27 21 441 0000',
    website: 'https://www.netcare.co.za',
    email: 'CBMHPreAdmissions@netcare.co.za',
    address:
      'Cnr DF Malan Street and Rua Bartholomeu Dias Plain, Foreshore, Cape Town, 8001',
    geoLocation: { latitude: -33.9189, longitude: 18.4287 },
    logoUrl: 'https://www.netcare.co.za/Images/Netcare-Logo.png',
    practices: [
      {
        name: 'Netcare Christiaan Barnard Memorial Hospital',
        address:
          'Cnr DF Malan Street and Rua Bartholomeu Dias Plain, Foreshore, Cape Town, 8001',
        geoLocation: { latitude: -33.9189, longitude: 18.4287 },
      },
      {
        name: 'Netcare Blaauwberg Hospital',
        address: 'Waterville Crescent, Sunningdale, Cape Town, 7441',
        geoLocation: { latitude: -33.804, longitude: 18.481 },
      },
      {
        name: 'Netcare Kuils River Hospital',
        address: '33 Van Riebeeck Road, Kuils River, Cape Town, 7580',
        geoLocation: { latitude: -33.921, longitude: 18.681 },
      },
      {
        name: 'Netcare N1 City Hospital',
        address: 'Louwtjie Rothman Street, Goodwood, Cape Town, 7460',
        geoLocation: { latitude: -33.894, longitude: 18.552 },
      },
      {
        name: 'Netcare UCT Private Academic Hospital',
        address: 'D18 Anzio Rd, Observatory, Cape Town, 7925',
        geoLocation: { latitude: -33.941, longitude: 18.463 },
      },
    ],
  },
  {
    name: 'Life Healthcare',
    telephone: '+27 21 670 4000',
    website: 'https://www.lifehealthcare.co.za',
    email: 'carmen.loots@lifehealthcare.co.za',
    address: 'Wilderness Road, Claremont, Cape Town, 7708',
    geoLocation: { latitude: -33.9802, longitude: 18.4672 },
    logoUrl: 'https://www.lifehealthcare.co.za/Images/logo.svg',
    practices: [
      {
        name: 'Life Kingsbury Hospital',
        address: 'Wilderness Road, Claremont, Cape Town, 7708',
        geoLocation: { latitude: -33.9802, longitude: 18.4672 },
      },
      {
        name: 'Life Vincent Pallotti Hospital',
        address: 'Alexandra Road, Pinelands, Cape Town, 7405',
        geoLocation: { latitude: -33.9405, longitude: 18.49 },
      },
      {
        name: 'Life Peninsula Eye Hospital',
        address: 'Wilderness Rd, Claremont, Cape Town, 7708',
        geoLocation: { latitude: -33.9802, longitude: 18.4672 },
      },
      {
        name: 'Life Sports Science Orthopaedic Surgical Day Centre',
        address: 'Boundary Rd, Newlands, Cape Town, 7700',
        geoLocation: { latitude: -33.9723, longitude: 18.4688 },
      },
    ],
  },
  {
    name: 'Western Cape Government Health (Public Sector)',
    telephone: '+27 21 483 3245',
    website: 'https://www.westerncape.gov.za/health-wellness/',
    email: 'Marika.Champion@westerncape.gov.za',
    address: '4 Dorp Street, Cape Town City Centre, Cape Town, 8001',
    geoLocation: { latitude: -33.9249, longitude: 18.4168 },
    logoUrl:
      'https://www.westerncape.gov.za/sites/all/themes/wcg_main/logo.png',
    practices: [
      {
        name: 'Groote Schuur Hospital',
        address: 'Main Rd, Observatory, Cape Town, 7925',
        geoLocation: { latitude: -33.9414, longitude: 18.4637 },
      },
      {
        name: 'Tygerberg Hospital',
        address: 'Francie Van Zijl Dr, Tygerberg, Cape Town, 7505',
        geoLocation: { latitude: -33.9038, longitude: 18.6146 },
      },
      {
        name: "Red Cross War Memorial Children's Hospital",
        address: 'Klipfontein Rd, Rondebosch, Cape Town, 7700',
        geoLocation: { latitude: -33.9536, longitude: 18.4883 },
      },
      {
        name: 'New Somerset Hospital',
        address: 'Portswood Rd, Green Point, Cape Town, 8005',
        geoLocation: { latitude: -33.904, longitude: 18.414 },
      },
      {
        name: 'Victoria Hospital Wynberg',
        address: 'Alphen Hill Rd, Wynberg, Cape Town, 7800',
        geoLocation: { latitude: -34.0084, longitude: 18.4619 },
      },
      {
        name: 'Mitchells Plain Hospital',
        address: '8 A Z Berman Dr, Lentegeur, Cape Town, 7785',
        geoLocation: { latitude: -34.047, longitude: 18.601 },
      },
      {
        name: 'False Bay Hospital',
        address: '17th Ave, Fish Hoek, Cape Town, 7975',
        geoLocation: { latitude: -34.1352, longitude: 18.4285 },
      },
      {
        name: 'Karl Bremer Hospital',
        address: 'Frans Conradie Dr, Bellville, Cape Town, 7530',
        geoLocation: { latitude: -33.896, longitude: 18.615 },
      },
    ],
  },
  {
    name: 'Melomed Hospital Group',
    telephone: '+27 21 699 0950',
    website: 'https://www.melomed.co.za',
    email: 'info@melomed.co.za',
    address: '148 Imam Haron Street, Gatesville, Cape Town, 7735',
    geoLocation: { latitude: -33.9749, longitude: 18.5303 },
    logoUrl: 'https://www.melomed.co.za/images/logo.png',
    practices: [
      {
        name: 'Melomed Gatesville',
        address: '148 Imam Haron Road, Gatesville, Cape Town, 7735',
        geoLocation: { latitude: -33.9749, longitude: 18.5303 },
      },
      {
        name: 'Melomed Bellville',
        address:
          'Cnr Voortrekker and AJ West Street, Bellville, Cape Town, 7530',
        geoLocation: { latitude: -33.9015, longitude: 18.6318 },
      },
      {
        name: 'Melomed Tokai',
        address: 'Cnr Keysers & Main Road, Tokai, Cape Town, 7945',
        geoLocation: { latitude: -34.0736, longitude: 18.4556 },
      },
      {
        name: 'Melomed Mitchells Plain',
        address: 'Symphony Walk, Town Centre, Mitchells Plain, Cape Town, 7785',
        geoLocation: { latitude: -34.0487, longitude: 18.6186 },
      },
    ],
  },
  {
    name: 'Busamed',
    telephone: '+27 21 840 6600',
    website: 'https://www.busamed.co.za',
    email: 'info.paardevlei@busamed.co.za',
    address:
      '4 Gardner Williams Avenue, Paardevlei Estate, Somerset West, Cape Town, 7130',
    geoLocation: { latitude: -34.0847, longitude: 18.8159 },
    logoUrl:
      'https://www.busamed.co.za/wp-content/uploads/2020/09/Busamed-Logo-Web.png',
    practices: [
      {
        name: 'Busamed Paardevlei Private Hospital',
        address:
          '4 Gardner Williams Avenue, Paardevlei Estate, Somerset West, Cape Town, 7130',
        geoLocation: { latitude: -34.0847, longitude: 18.8159 },
      },
    ],
  },
  {
    name: 'The Salvation Army',
    telephone: '+27 21 465 4846',
    website: 'https://boothhosp.org',
    email: 'info@boothhosp.org',
    address: '32 Prince Street, Oranjezicht, Cape Town, 8001',
    geoLocation: { latitude: -33.9405, longitude: 18.4116 },
    logoUrl:
      'https://www.salvationarmy.org.za/wp-content/themes/salvation-army/images/logo.png',
    practices: [
      {
        name: 'Booth Memorial Hospital',
        address: '32 Prince Street, Oranjezicht, Cape Town, 8001',
        geoLocation: { latitude: -33.9405, longitude: 18.4116 },
      },
    ],
  },
];

function parseAddress(fullAddress: string) {
  const parts = fullAddress.split(',').map((p) => p.trim());
  return {
    address: parts[0],
    city: parts[parts.length - 2] || 'Cape Town',
    state: 'Western Cape',
    zip: parts[parts.length - 1] || '8001',
  };
}

async function seedHospitals(ds: DataSource): Promise<void> {
  console.log('🌱 Seeding hospital network (tenants + practices)...');
  const tenantRepo = ds.getRepository(Tenant);
  const practiceRepo = ds.getRepository(Practice);

  for (const tenantData of HOSPITAL_DATA) {
    let tenant = await tenantRepo.findOne({ where: { name: tenantData.name } });
    if (!tenant) {
      tenant = tenantRepo.create({
        name: tenantData.name,
        email: tenantData.email,
        phone: tenantData.telephone,
        website: tenantData.website,
        imageUrl: tenantData.logoUrl,
        status: ResourceStatus.ACTIVE,
      });
      tenant = await tenantRepo.save(tenant);
      console.log(`  ✅ Tenant: ${tenant.name}`);
    } else {
      console.log(`  ℹ️  Tenant exists: ${tenant.name}`);
    }

    for (const practiceData of tenantData.practices) {
      const existing = await practiceRepo.findOne({
        where: { name: practiceData.name, tenant: { id: tenant.id } },
      });
      if (existing) {
        console.log(`    ℹ️  Practice exists: ${existing.name}`);
        continue;
      }
      const addr = parseAddress(practiceData.address);
      const practice = practiceRepo.create({
        tenant,
        name: practiceData.name,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        phone: tenantData.telephone,
        email: tenantData.email,
        website: tenantData.website,
        latitude: practiceData.geoLocation.latitude,
        longitude: practiceData.geoLocation.longitude,
        status: ResourceStatus.ACTIVE,
      });
      await practiceRepo.save(practice);
      console.log(`    📍 Practice: ${practice.name}`);
    }
  }
}

// =====================================================================
// Core demo data (the Atlantic clinic + Doe family)
// =====================================================================
async function seedCoreData(ds: DataSource): Promise<void> {
  console.log('🌱 Seeding core demo data...');
  const userRepo = ds.getRepository(User);
  const tenantRepo = ds.getRepository(Tenant);
  const practiceRepo = ds.getRepository(Practice);
  const childRepo = ds.getRepository(Child);
  const clinicianProfileRepo = ds.getRepository(ClinicianProfile);
  const reportRepo = ds.getRepository(Report);
  const appointmentRepo = ds.getRepository(Appointment);
  const allergyRepo = ds.getRepository(Allergy);
  const conditionRepo = ds.getRepository(MedicalCondition);
  const growthRepo = ds.getRepository(GrowthRecord);
  const milestoneRepo = ds.getRepository(CompletedMilestone);
  const vaccineRepo = ds.getRepository(CompletedVaccination);

  // Tenant
  let tenant = await tenantRepo.findOne({
    where: { email: 'contact@raisingatlantic.com' },
  });
  if (!tenant) {
    tenant = await tenantRepo.save(
      tenantRepo.create({
        name: 'Raising Atlantic Health',
        email: 'contact@raisingatlantic.com',
        phone: '(021) 555-0123',
        website: 'https://raisingatlantic.com',
        status: ResourceStatus.ACTIVE,
      }),
    );
    console.log('  ✅ Demo Tenant');
  }

  // Practice
  let practice = await practiceRepo.findOne({
    where: { name: 'Atlantic Cape Town Clinic' },
    relations: ['clinicians'],
  });
  if (!practice) {
    practice = await practiceRepo.save(
      practiceRepo.create({
        tenant,
        name: 'Atlantic Cape Town Clinic',
        address: '123 Main St, Cape Town',
        city: 'Cape Town',
        state: 'Western Cape',
        zip: '8001',
        phone: '(021) 555-9876',
        status: ResourceStatus.ACTIVE,
        clinicians: [],
      }),
    );
    console.log('  ✅ Demo Practice');
  }

  // Clinician + profile
  let clinician = await userRepo.findOne({
    where: { email: 'dr.smith@clinician.com' },
  });
  if (!clinician) {
    clinician = await userRepo.save(
      userRepo.create({
        title: 'Dr.',
        name: 'John Smith',
        email: 'dr.smith@clinician.com',
        phone: '(021) 987-6543',
        role: UserRole.CLINICIAN,
      }),
    );
    const profile = await clinicianProfileRepo.save(
      clinicianProfileRepo.create({
        user: clinician,
        specialty: 'Pediatrician',
        bio: 'Expert in early childhood development with over 15 years of experience.',
      }),
    );
    practice.clinicians = [profile];
    await practiceRepo.save(practice);
    console.log('  ✅ Clinician + ClinicianProfile');
  }

  // Parent
  let parent = await userRepo.findOne({
    where: { email: 'jane.doe@example.com' },
  });
  if (!parent) {
    parent = await userRepo.save(
      userRepo.create({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '(021) 123-4567',
        role: UserRole.PARENT,
      }),
    );
    console.log('  ✅ Parent (Jane Doe)');
  }

  // Admin + super-admin
  if (
    !(await userRepo.findOne({ where: { email: 'admin@raisingatlantic.com' } }))
  ) {
    await userRepo.save(
      userRepo.create({
        name: 'Admin User',
        email: 'admin@raisingatlantic.com',
        phone: '(021) 555-5555',
        role: UserRole.ADMIN,
      }),
    );
    console.log('  ✅ Admin');
  }
  if (
    !(await userRepo.findOne({ where: { email: 'super@raisingatlantic.com' } }))
  ) {
    await userRepo.save(
      userRepo.create({
        name: 'Super Admin',
        email: 'super@raisingatlantic.com',
        phone: '(021) 000-0000',
        role: UserRole.SUPER_ADMIN,
      }),
    );
    console.log('  ✅ Super Admin');
  }

  // Child (Alex Doe) — idempotent: re-seed sub-records every run for clean demo state
  let child = await childRepo.findOne({
    where: { firstName: 'Alex', lastName: 'Doe' },
  });
  if (!child) {
    child = await childRepo.save(
      childRepo.create({
        parent,
        clinician,
        name: 'Alex Doe',
        firstName: 'Alex',
        lastName: 'Doe',
        gender: 'male',
        dateOfBirth: new Date('2024-02-15'),
        status: ResourceStatus.ACTIVE,
        notes:
          'Loves babbling and trying to sit up. Very curious about toys that make noise.',
        progress: 20,
      }),
    );
  }

  await growthRepo.delete({ child: { id: child.id } });
  await milestoneRepo.delete({ child: { id: child.id } });
  await vaccineRepo.delete({ child: { id: child.id } });
  await allergyRepo.delete({ child: { id: child.id } });
  await conditionRepo.delete({ child: { id: child.id } });
  await reportRepo.delete({ child: { id: child.id } });
  await appointmentRepo.delete({ child: { id: child.id } });

  await growthRepo.save([
    {
      child,
      date: new Date('2024-02-15'),
      height: '50cm',
      weight: '3.3kg',
      notes: 'Birth measurements.',
    },
    {
      child,
      date: new Date('2024-04-15'),
      height: '58cm',
      weight: '5.6kg',
      notes: '2-month check-up.',
    },
    {
      child,
      date: new Date('2024-06-15'),
      height: '64cm',
      weight: '7.0kg',
      notes: '4-month check-up.',
    },
    {
      child,
      date: new Date('2024-08-15'),
      height: '68cm',
      weight: '7.9kg',
      notes: '6-month check-up.',
      status: ResourceStatus.PENDING_ASSESSMENT,
    },
  ]);

  await milestoneRepo.save([
    { child, milestoneId: 'm_2mo_soc_1', dateAchieved: new Date('2024-04-10') },
    { child, milestoneId: 'm_2mo_lan_1', dateAchieved: new Date('2024-04-12') },
    {
      child,
      milestoneId: 'm_4mo_mot_1',
      dateAchieved: new Date('2024-06-15'),
      notes: 'Loves rolling around during tummy time.',
    },
    {
      child,
      milestoneId: 'm_6mo_lan_1',
      dateAchieved: new Date('2024-08-18'),
      status: ResourceStatus.PENDING_ASSESSMENT,
    },
  ]);

  await vaccineRepo.save([
    { child, vaccineId: 'hepB1', dateAdministered: new Date('2024-02-15') },
    { child, vaccineId: 'hepB2', dateAdministered: new Date('2024-04-15') },
    { child, vaccineId: 'rv1', dateAdministered: new Date('2024-04-15') },
    {
      child,
      vaccineId: 'dtap1',
      dateAdministered: new Date('2024-04-15'),
      status: ResourceStatus.PENDING_ASSESSMENT,
    },
  ]);

  await allergyRepo.save([
    {
      child,
      allergen: 'Peanuts',
      severity: 'severe',
      notes: 'Requires EpiPen',
    },
    { child, allergen: 'Dust', severity: 'mild' },
  ]);

  await conditionRepo.save([
    {
      child,
      conditionName: 'Eczema',
      diagnosisDate: new Date('2024-03-01'),
      status: ResourceStatus.ACTIVE,
    },
  ]);

  await appointmentRepo.save([
    {
      child,
      clinician,
      practice,
      scheduledAt: new Date(Date.now() + 86400000 * 7),
      status: AppointmentStatus.SCHEDULED,
      notes: '9-month wellness checkup',
    },
  ]);

  await reportRepo.save([
    {
      child,
      type: ReportType.CRECHE_ADMISSION,
      status: ResourceStatus.ACTIVE,
      generatedBy: clinician,
      content: {
        summary:
          'Alex is fit for creche admission with clear immunization record.',
      },
    },
  ]);

  console.log('  ✅ Child (Alex Doe) + sub-records');
}

// =====================================================================
// Blog posts
// =====================================================================
const BLOG_POSTS = [
  {
    title:
      "Goodbye Paper, Hello Cloud: Modernizing South Africa's Road to Health Booklet",
    slug: 'modernizing-the-road-to-health',
    shortDescription:
      'Discover how digitizing the traditional RtHB ensures you never lose a medical record again.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    synopsis:
      'The traditional physical Road to Health booklet is highly susceptible to being lost or damaged, leading to fragmented pediatric care. By switching to a secure, cloud-based ledger, parents and clinicians ensure permanent continuity of care.',
    body: `## The Problem with Paper Records
For decades, the physical South African National Department of Health (DoH) Road to Health booklet (RtHB) has been the standard for tracking a child's early development. However, these physical booklets are highly susceptible to loss, damage, or incomplete entries. This fragmentation creates a critical lack of "Continuity of Care," forcing pediatricians and parents to rely on incomplete historical data, which can severely delay early interventions.

## The Digital Ledger Solution
Raising Atlantic bridges this communication gap by acting as a secure, immutable, cloud-based ledger. Rather than relying on a physical book, parents can now utilize a digital platform to track their child's holistic growth.

| Feature | Physical RtHB | Raising Atlantic Digital Platform |
| :--- | :--- | :--- |
| **Durability** | Prone to loss and damage | Immutable cloud-based ledger |
| **Accessibility** | Must be physically present | Accessible via mobile app anywhere |
| **Reminders** | Manual tracking required | Automated immunization alerts |

By digitalizing these records, parents gain peace of mind by eliminating the "lost book" problem, while clinicians reduce clinical liability and gain immediate access to accurate, historical clinical datasets.`,
    isPublished: true,
  },
  {
    title:
      'The AI Co-Pilot: How Artificial Intelligence is Enhancing Pediatric Care',
    slug: 'the-ai-copilot-pediatric-care',
    shortDescription:
      'From intelligent clinical summaries to reducing administrative burdens, discover how AI is transforming collaborative healthcare.',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    synopsis:
      'AI digital health solutions possess massive potential to enhance clinical efficiency, reduce costs, and improve global health outcomes. By automating administrative tasks and generating intelligent summaries.',
    body: `## The Healthcare AI Revolution
The World Economic Forum highlights that AI digital health solutions hold the potential to radically enhance efficiency and improve health outcomes globally. Despite this, healthcare has traditionally been "below average" in adopting AI compared to other industries. A major pain point in the medical field is time-consuming administrative tasks; utilizing AI co-pilots can free up clinicians to focus more of their time on actual patients.

## Intelligent Summaries in Raising Atlantic
Raising Atlantic integrates Google's GenKit AI (leveraging the Gemini 2.0 Flash model) to serve as a powerful analytics engine.

This technology is utilized to:
*   Process synthetic health contexts.
*   Provide intelligent clinical summaries before a physical consultation.
*   Orchestrate localized, intelligent chat interactions for parents.

By streamlining the review of longitudinal charts and notes prior to physical consultations, pediatricians can spend less time on administration and more time providing compassionate care.`,
    isPublished: true,
  },
  {
    title: 'Demystifying the South African EPI Schedule for New Parents',
    slug: 'demystifying-sa-epi-schedule',
    shortDescription:
      "Learn how automated alerts can keep your child's complex vaccination schedule perfectly on track.",
    imageUrl:
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=800&q=80',
    synopsis:
      'The South African Expanded Programme on Immunisation (EPI) is a strict scientific timetable dictating which vaccines children must receive at specific ages. Automated digital tools help parents stay aligned.',
    body: `## Understanding the EPI Schedule
The South African Expanded Programme on Immunisation (EPI) is a scientifically formulated timetable. It specifies precisely which vaccines a child MUST receive at explicitly defined ages, from birth up to 12 years. Managing this complex schedule can be overwhelming for new parents. Furthermore, parents often have to navigate the integration of state vaccines with optional private vaccines.

## Automated Alerts for Peace of Mind
Raising Atlantic's programmatic immunization logic strictly follows the 2024/2025 South African EPI schedule, adhering exclusively to the latest Department of Health guidelines.

The platform's **Parent Dashboard** provides:
*   An aggregated overview of all registered children.
*   Dynamic progress bars tracking immunization status.
*   Actionable alerts for upcoming or missed EPI vaccinations.

By automating these reminders, parents no longer have to worry about missing crucial health milestones.`,
    isPublished: true,
  },
  {
    title:
      'Beyond the Basics: Tracking Growth Velocity and Developmental Milestones',
    slug: 'tracking-growth-velocity-and-milestones',
    shortDescription:
      "Why measuring your child's growth rate is just as important as recording their absolute height and weight.",
    imageUrl:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    synopsis:
      'Growth velocity measures the mathematical rate of physical growth to ensure children stay aligned to an optimal percentile curve. Tracking these metrics alongside cognitive and physical milestones ensures a comprehensive view.',
    body: `## What is Growth Velocity?
While recording a child's absolute weight or height is standard practice, clinicians rely on **Growth Velocity**—the mathematical rate of physical growth across time—to ensure a child remains aligned to an optimal percentile curve.

Through Raising Atlantic, parents can input episodic weight, height, and head circumference data. The platform then translates these static numbers into precise, longitudinal growth percentiles.

## Developmental Milestones
Development is not just physical. The platform utilizes a static dictionary of age-graded developmental markers (from 2 months to 5 years) to track crucial milestones.

Parents can easily check off achievements across four key domains:
1.  **Cognitive**
2.  **Social/Emotional**
3.  **Language**
4.  **Physical**

By logging these milestones from a mobile device, parents push the data directly to their clinician for professional review, ensuring no developmental delays go unnoticed.`,
    isPublished: true,
  },
  {
    title:
      'Bridging the Gap: How Collaborative Care Improves Pediatric Outcomes',
    slug: 'bridging-the-gap-collaborative-care',
    shortDescription:
      'Explore the clinical verification loop that securely connects parents logging milestones at home with their pediatricians.',
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    synopsis:
      "Seamless communication between home and the clinic is vital for early interventions and child development. Through a secure verification loop, parent-logged data enters a 'Pending Assessment' state.",
    body: `## The Fragmentation of Care
A massive hurdle in modern pediatrics is the fragmentation of data between the home and the clinic. Parents observe daily milestones, while clinicians only see the child during brief, episodic visits.

## The Verification Loop Workflow
Raising Atlantic solves this by implementing a strict "Verification Loop".

Here is how the collaborative care cycle works:
1.  **Parent Logging:** A parent inputs their child's latest physical stats or checks off a new milestone directly from their mobile device.
2.  **Pending Assessment:** This logged data enters a transient \`PENDING_ASSESSMENT\` state, identifying that it lacks formal validation.
3.  **Clinician Authentication:** The authorized clinician reviews the pending records on their dashboard, adding medical notes and authenticating the entry to finalize it as verified medical history.

Furthermore, all clinicians on the platform are strictly vetted against official HPCSA or SANC databases, ensuring absolute clinical legitimacy.`,
    isPublished: true,
  },
  {
    title:
      'Budgeting for Baby: The Cost of Pediatric Healthcare in South Africa',
    slug: 'budgeting-for-baby-healthcare-costs',
    shortDescription:
      'A breakdown of early childhood medical expenses and how affordable SaaS platforms can help manage them.',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    synopsis:
      'Raising a child in South Africa comes with significant financial demands, including up to R1,600 for private clinic vaccinations. Cost-effective digital health platforms offer tiered pricing.',
    body: `## The Staggering Costs of Raising a Child
According to recent estimates, the cost of raising a child in a middle-income South African family can reach up to R1.6 million. Initial setup costs for a nursery, clothes, and basics sit around R14,000. When it comes to healthcare, vaccinations at a private clinic can cost roughly R1,600, while specialized clinics cost about R200 per month.

## Professional-Grade Tracking on a Budget
While medical costs are high, managing your child's healthcare records shouldn't break the bank. Raising Atlantic offers highly transparent pricing plans designed to fit any family's budget.

| Plan Tier | Monthly Cost | Key Features |
| :--- | :--- | :--- |
| **Starter** | Free | 1 Child Profile, Essential Growth Tracking, Standard EPI Schedule |
| **Pro** | R99 / month | Up to 3 Children, Advanced Growth Analytics, Crèche Admission PDF Reports |
| **Premium** | R220 / month | Unlimited Children, Multi-Caregiver Network, Allergy & Diet Tracking |

By utilizing affordable digital tools, modern families can ensure premium healthcare tracking without compromising their monthly budget.`,
    isPublished: true,
  },
];

async function seedBlogPosts(ds: DataSource): Promise<void> {
  console.log('🌱 Seeding blog posts...');
  const repo = ds.getRepository(BlogPost);
  for (const data of BLOG_POSTS) {
    const existing = await repo.findOne({ where: { slug: data.slug } });
    if (existing) {
      Object.assign(existing, data);
      await repo.save(existing);
      console.log(`  ↻ Updated: ${data.title}`);
    } else {
      await repo.save(repo.create(data));
      console.log(`  ✅ Created: ${data.title}`);
    }
  }
}

// =====================================================================
// Orchestrator
// =====================================================================
async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('🌱 Starting full seed...');
  try {
    await seedExamples(AppDataSource);
    await seedHospitals(AppDataSource);
    await seedCoreData(AppDataSource);
    await seedBlogPosts(AppDataSource);
    console.log('🏁 All seeds completed successfully.');
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
