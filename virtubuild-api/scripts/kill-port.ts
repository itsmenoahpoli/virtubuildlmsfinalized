#!/usr/bin/env ts-node

import { exec } from 'child_process';

const port = process.argv[2] || process.env.APP_PORT || '3000';

console.log(`🔍 Checking for processes on port ${port}...`);

const killPort = (port: string) => {
  const command = process.platform === 'win32' 
    ? `netstat -ano | findstr :${port}` 
    : `lsof -ti:${port}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`✅ No process found on port ${port}`);
      return;
    }

    if (process.platform === 'win32') {
      const lines = stdout.trim().split('\n');
      const pids = lines
        .map(line => line.trim().split(/\s+/).pop())
        .filter(pid => pid && pid !== '0')
        .filter((pid, index, array) => array.indexOf(pid) === index);

      if (pids.length === 0) {
        console.log(`✅ No process found on port ${port}`);
        return;
      }

      console.log(`🔪 Killing processes on port ${port}: ${pids.join(', ')}`);
      pids.forEach(pid => {
        exec(`taskkill /PID ${pid} /F`, (killError) => {
          if (killError) {
            console.error(`❌ Failed to kill process ${pid}:`, killError.message);
          } else {
            console.log(`✅ Killed process ${pid}`);
          }
        });
      });
    } else {
      const pids = stdout.trim().split('\n').filter(pid => pid.trim());
      
      if (pids.length === 0) {
        console.log(`✅ No process found on port ${port}`);
        return;
      }

      console.log(`🔪 Killing processes on port ${port}: ${pids.join(', ')}`);
      exec(`kill -9 ${pids.join(' ')}`, (killError) => {
        if (killError) {
          console.error(`❌ Failed to kill processes:`, killError.message);
        } else {
          console.log(`✅ Successfully killed processes on port ${port}`);
        }
      });
    }
  });
};

killPort(port);
