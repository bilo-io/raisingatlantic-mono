import { ExamplesController } from './apps/api/examples/examples.controller';
import { ExamplesService } from './apps/api/examples/examples.service';
import { GcpLoggerService } from './core/telemetry/gcp/logger.service';
import { GcpTracingService } from './core/telemetry/gcp/tracer.service';
import { GcpMetricService } from './core/telemetry/gcp/metric.service';
import { GcpErrorReportingService } from './core/telemetry/gcp/error-reporter.service';

/**
 * Test runner script to simulate Dependency Injection
 */
async function main() {
  console.log('--- Initializing Application... ---');

  // Manual Dependency Injection Setup
  const gcpLogger = new GcpLoggerService();
  const gcpTracer = new GcpTracingService();
  const gcpMetric = new GcpMetricService();
  const gcpErrorReporter = new GcpErrorReportingService();

  const examplesService = new ExamplesService(
    gcpLogger,
    gcpTracer,
    gcpMetric,
    gcpErrorReporter
  );

  const examplesController = new ExamplesController(examplesService);

  console.log('\n--- 1. Testing Create Example (POST) ---');
  const createResult = await examplesController.create({
    name: 'Sample Example',
    description: 'This is a test description'
  });
  console.log('Create result:', createResult);

  const exampleId = createResult.data!.id;

  console.log('\n--- 2. Testing Get All (GET) ---');
  const getAllResult = await examplesController.findAll();
  console.log('Get all result count:', getAllResult.data!.length);

  console.log('\n--- 3. Testing Get by ID (GET) ---');
  const getByIdResult = await examplesController.findOne(exampleId);
  console.log('Get by ID result:', getByIdResult);

  console.log('\n--- 4. Testing Update (PATCH/PUT) ---');
  const updateResult = await examplesController.update(exampleId, {
    name: 'Updated Sample Example'
  });
  console.log('Update result:', updateResult);

  console.log('\n--- 5. Testing Delete (DELETE) ---');
  const deleteResult = await examplesController.remove(exampleId);
  console.log('Delete result:', deleteResult);

  console.log('\n--- Final Verification: Get All Empty Check ---');
  const emptyCheck = await examplesController.findAll();
  console.log('Remaining example count:', emptyCheck.data!.length);
}

main().catch(err => {
    console.error('Fatal testing error', err);
});
