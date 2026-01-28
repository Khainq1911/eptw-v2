const { execSync } = require('child_process');

const args = process.argv.slice(2);
const name = args[0];

if (!name) {
  console.error('Error: Please provide a migration name.');
  console.error('Usage: npm run migration:generate <name>');
  process.exit(1);
}

const command = `typeorm-ts-node-commonjs migration:generate src/database/migrations/${name} -d src/database/data-source.ts`;

console.log(`Running: ${command}`);

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
