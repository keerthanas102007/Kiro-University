import { execSync } from 'child_process';

console.log('========================================');
console.log('       TODO APP QUALITY CHECK           ');
console.log('========================================\n');

let testPassed = false;
let lintPassed = false;

// 1. Run Tests
console.log('---> Running Unit & Property Tests (npm test)...');
try {
  const testOutput = execSync('node --experimental-vm-modules node_modules/jest/bin/jest.js', { encoding: 'utf8', stdio: 'pipe' });
  console.log(testOutput);
  testPassed = true;
  console.log('✅ TEST RESULT: PASS\n');
} catch (error) {
  console.error('❌ TEST RESULT: FAIL');
  if (error.stdout) console.log(error.stdout);
  if (error.stderr) console.error(error.stderr);
  console.log('');
}

// 2. Run Lint
console.log('---> Running ESLint Checks (npm run lint)...');
try {
  const lintOutput = execSync('npx eslint src --ext .js,.ts', { encoding: 'utf8', stdio: 'pipe' });
  console.log(lintOutput || 'No lint errors found.');
  lintPassed = true;
  console.log('✅ LINT RESULT: PASS\n');
} catch (error) {
  console.error('❌ LINT RESULT: FAIL');
  if (error.stdout) console.log(error.stdout);
  if (error.stderr) console.error(error.stderr);
  console.log('');
}

// Summary Report
console.log('========================================');
console.log('         QUALITY CHECK SUMMARY          ');
console.log('========================================');
console.log(`Tests Status: ${testPassed ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Lint Status:  ${lintPassed ? '✅ PASS' : '❌ FAIL'}`);

if (testPassed && lintPassed) {
  console.log('\n🎉 ALL QUALITY CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('\n⚠️ QUALITY CHECK FAILED. Please resolve errors above before committing.');
  process.exit(1);
}
