#!/usr/bin/env node
/**
 * Stop Handler Script
 * Gracefully terminates the API to Postman application
 * Kills processes on ports 3000 (backend) and 5173 (frontend)
 */

const { exec, execSync } = require('child_process');
const os = require('os');

const PORT_BACKEND = 3000;
const PORT_FRONTEND = 5173;

console.log('\n====================================');
console.log('API to Postman Test Generator');
console.log('Stopping Application...');
console.log('====================================\n');

function killPortWindows(port) {
  return new Promise((resolve) => {
    try {
      // Get process ID on the port
      const cmd = `netstat -ano | findstr :${port} | findstr LISTENING`;
      exec(cmd, { shell: 'cmd.exe' }, (error, stdout) => {
        if (stdout) {
          const pids = stdout.split('\n').map(line => {
            const parts = line.trim().split(/\s+/);
            return parts[parts.length - 1];
          }).filter(pid => pid && pid !== 'PID');

          if (pids.length > 0) {
            pids.forEach(pid => {
              try {
                execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                console.log(`[OK] Process on port ${port} (PID: ${pid}) terminated.`);
              } catch (e) {
                console.log(`[INFO] Could not terminate process on port ${port}.`);
              }
            });
          }
        } else {
          console.log(`[INFO] No process found on port ${port}.`);
        }
        resolve();
      });
    } catch (error) {
      console.log(`[INFO] Port ${port} not in use.`);
      resolve();
    }
  });
}

function killPortUnix(port) {
  return new Promise((resolve) => {
    try {
      const cmd = `lsof -ti:${port}`;
      exec(cmd, (error, stdout) => {
        if (stdout) {
          const pid = stdout.trim();
          exec(`kill -9 ${pid}`, () => {
            console.log(`[OK] Process on port ${port} (PID: ${pid}) terminated.`);
            resolve();
          });
        } else {
          console.log(`[INFO] No process found on port ${port}.`);
          resolve();
        }
      });
    } catch (error) {
      console.log(`[INFO] Port ${port} not in use.`);
      resolve();
    }
  });
}

async function stopApplication() {
  const isWindows = os.platform() === 'win32';

  console.log(`[*] Stopping backend server (port ${PORT_BACKEND})...`);
  await (isWindows ? killPortWindows(PORT_BACKEND) : killPortUnix(PORT_BACKEND));

  console.log(`[*] Stopping frontend server (port ${PORT_FRONTEND})...`);
  await (isWindows ? killPortWindows(PORT_FRONTEND) : killPortUnix(PORT_FRONTEND));

  console.log('\n[OK] Application stopped successfully.');
  console.log('====================================\n');
  
  // Verify ports are free
  setTimeout(() => {
    console.log('[✓] Verifying ports are free...');
    if (isWindows) {
      try {
        const result = execSync(`netstat -ano | findstr ":${PORT_BACKEND} :"`, { 
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        if (!result) {
          console.log(`[✓] Port ${PORT_BACKEND} is free.`);
        }
      } catch (e) {
        console.log(`[✓] Port ${PORT_BACKEND} is free.`);
      }
      try {
        const result = execSync(`netstat -ano | findstr ":${PORT_FRONTEND} :"`, { 
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        if (!result) {
          console.log(`[✓] Port ${PORT_FRONTEND} is free.`);
        }
      } catch (e) {
        console.log(`[✓] Port ${PORT_FRONTEND} is free.`);
      }
    }
    console.log('[✓] Ready to start a new instance with: npm run dev\n');
  }, 500);
}

stopApplication().catch(error => {
  console.error('[ERROR] Failed to stop application:', error.message);
  process.exit(1);
});
