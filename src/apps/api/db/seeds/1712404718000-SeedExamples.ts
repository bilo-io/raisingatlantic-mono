import { AppDataSource } from '../data-source';

/**
 * Seed script for the examples table.
 * Run via: npm run seed:run
 */
async function seed(): Promise<void> {
  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository('examples');

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log(`⚠️  Skipping seed — examples table already has ${existingCount} row(s).`);
    await AppDataSource.destroy();
    return;
  }

  const seeds = [
    {
      name: 'First Example',
      description: 'This is the first seeded example record.',
    },
    {
      name: 'Second Example',
      description: 'This is the second seeded example record.',
    },
    {
      name: 'Third Example',
      description: null,
    },
  ];

  await repo.save(seeds);

  console.log(`✅  Seeded ${seeds.length} example(s) successfully.`);
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
