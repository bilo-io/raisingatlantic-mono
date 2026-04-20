import { AppDataSource } from '../data-source';
import { BlogPost } from '../../src/blog/blog.model';

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('🌱 Starting blog seed...');

  const blogRepo = AppDataSource.getRepository(BlogPost);

  const posts = [
    {
      title: "Goodbye Paper, Hello Cloud: Modernizing South Africa's Road to Health Booklet",
      slug: "modernizing-the-road-to-health",
      shortDescription: "Discover how digitizing the traditional RtHB ensures you never lose a medical record again.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&w=800&q=80",
      synopsis: "The traditional physical Road to Health booklet is highly susceptible to being lost or damaged, leading to fragmented pediatric care. By switching to a secure, cloud-based ledger, parents and clinicians ensure permanent continuity of care.",
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
      title: "The AI Co-Pilot: How Artificial Intelligence is Enhancing Pediatric Care",
      slug: "the-ai-copilot-pediatric-care",
      shortDescription: "From intelligent clinical summaries to reducing administrative burdens, discover how AI is transforming collaborative healthcare.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      synopsis: "AI digital health solutions possess massive potential to enhance clinical efficiency, reduce costs, and improve global health outcomes. By automating administrative tasks and generating intelligent summaries.",
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
      title: "Demystifying the South African EPI Schedule for New Parents",
      slug: "demystifying-sa-epi-schedule",
      shortDescription: "Learn how automated alerts can keep your child's complex vaccination schedule perfectly on track.",
      imageUrl: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=800&q=80",
      synopsis: "The South African Expanded Programme on Immunisation (EPI) is a strict scientific timetable dictating which vaccines children must receive at specific ages. Automated digital tools help parents stay aligned.",
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
      title: "Beyond the Basics: Tracking Growth Velocity and Developmental Milestones",
      slug: "tracking-growth-velocity-and-milestones",
      shortDescription: "Why measuring your child's growth rate is just as important as recording their absolute height and weight.",
      imageUrl: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&w=800&q=80",
      synopsis: "Growth velocity measures the mathematical rate of physical growth to ensure children stay aligned to an optimal percentile curve. Tracking these metrics alongside cognitive and physical milestones ensures a comprehensive view.",
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
      title: "Bridging the Gap: How Collaborative Care Improves Pediatric Outcomes",
      slug: "bridging-the-gap-collaborative-care",
      shortDescription: "Explore the clinical verification loop that securely connects parents logging milestones at home with their pediatricians.",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      synopsis: "Seamless communication between home and the clinic is vital for early interventions and child development. Through a secure verification loop, parent-logged data enters a 'Pending Assessment' state.",
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
      title: "Budgeting for Baby: The Cost of Pediatric Healthcare in South Africa",
      slug: "budgeting-for-baby-healthcare-costs",
      shortDescription: "A breakdown of early childhood medical expenses and how affordable SaaS platforms can help manage them.",
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      synopsis: "Raising a child in South Africa comes with significant financial demands, including up to R1,600 for private clinic vaccinations. Cost-effective digital health platforms offer tiered pricing.",
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

  for (const postData of posts) {
    let post = await blogRepo.findOne({ where: { slug: postData.slug } });
    if (!post) {
      post = blogRepo.create(postData);
      await blogRepo.save(post);
      console.log(`✅ Seeded blog post: ${postData.title}`);
    } else {
      Object.assign(post, postData);
      await blogRepo.save(post);
      console.log(`Updated blog post: ${postData.title}`);
    }
  }

  console.log('🏁 Blog seed completed successfully.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Blog seed failed:', err);
  process.exit(1);
});
