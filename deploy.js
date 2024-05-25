import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const { GIT_USER, GITHUB_ACCESS_TOKEN } = process.env;

if (!GIT_USER || !GITHUB_ACCESS_TOKEN) {
    console.error('GIT_USER and GIT_TOKEN must be set in the .env file');
    process.exit(1);
}

const command = `gh-pages -d dist --repo https://${GIT_USER}:${GITHUB_ACCESS_TOKEN}@github.com/nachpok/ca-mail.git`;

try {
    execSync(command, { stdio: 'inherit' });
    console.log('Deployment successful!');
} catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
}