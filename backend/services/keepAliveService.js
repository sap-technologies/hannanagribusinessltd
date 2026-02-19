import cron from 'node-cron';
import https from 'https';
import http from 'http';

/**
 * Keep-Alive Service for Render Free Tier
 * 
 * Render free tier services sleep after 15 minutes of inactivity.
 * This service pings the server every 14 minutes to keep it awake.
 * 
 * How it works:
 * 1. Schedules a cron job to run every 14 minutes
 * 2. Makes a GET request to the /api/health endpoint
 * 3. Logs the response to confirm the server is alive
 * 
 * Note: This will keep your server awake 24/7, which uses free tier hours.
 * Render free tier provides 750 hours per month (enough for 1 service to run continuously).
 */

class KeepAliveService {
  constructor() {
    this.serverUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL || 'http://localhost:1230';
    this.pingInterval = '*/14 * * * *'; // Every 14 minutes
    this.isActive = false;
    this.lastPing = null;
    this.pingCount = 0;
    this.failedPings = 0;
  }

  /**
   * Start the keep-alive service
   * Only runs in production (on Render) unless FORCE_KEEP_ALIVE is set
   */
  start() {
    // Only run in production or if explicitly enabled
    const shouldRun = process.env.NODE_ENV === 'production' || 
                      process.env.FORCE_KEEP_ALIVE === 'true' ||
                      process.env.RENDER_EXTERNAL_URL;

    if (!shouldRun) {
      console.log('⏸️  Keep-Alive Service: Disabled (not in production)');
      console.log('   Set FORCE_KEEP_ALIVE=true to enable in development\n');
      return;
    }

    console.log('🔄 Keep-Alive Service Starting...');
    console.log(`   Target URL: ${this.serverUrl}/api/health`);
    console.log(`   Ping Interval: Every 14 minutes`);
    console.log(`   Purpose: Prevent Render free tier from sleeping\n`);

    // Schedule the cron job
    this.cronJob = cron.schedule(this.pingInterval, () => {
      this.ping();
    });

    this.isActive = true;

    // Do an initial ping after 5 seconds
    setTimeout(() => {
      console.log('🔄 Keep-Alive: Performing initial ping...\n');
      this.ping();
    }, 5000);
  }

  /**
   * Stop the keep-alive service
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.isActive = false;
      console.log('⏸️  Keep-Alive Service: Stopped');
    }
  }

  /**
   * Ping the server to keep it alive
   */
  async ping() {
    const startTime = Date.now();
    const healthUrl = `${this.serverUrl}/api/health`;
    
    console.log(`🏓 Keep-Alive Ping #${this.pingCount + 1} at ${new Date().toLocaleTimeString()}`);

    try {
      const protocol = this.serverUrl.startsWith('https') ? https : http;
      
      const response = await new Promise((resolve, reject) => {
        const request = protocol.get(healthUrl, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              data: data
            });
          });
        });

        request.on('error', (error) => {
          reject(error);
        });

        // Timeout after 10 seconds
        request.setTimeout(10000, () => {
          request.destroy();
          reject(new Error('Request timeout'));
        });
      });

      const duration = Date.now() - startTime;
      
      if (response.statusCode === 200) {
        this.pingCount++;
        this.lastPing = new Date();
        this.failedPings = 0; // Reset failed count on success
        
        console.log(`   ✅ Server is alive (${duration}ms)`);
        console.log(`   Total successful pings: ${this.pingCount}`);
        console.log(`   Last ping: ${this.lastPing.toLocaleTimeString()}`);
        console.log(`   Next ping: ${this.getNextPingTime()}\n`);
      } else {
        throw new Error(`Unexpected status code: ${response.statusCode}`);
      }
    } catch (error) {
      this.failedPings++;
      const duration = Date.now() - startTime;
      
      console.error(`   ❌ Ping failed (${duration}ms): ${error.message}`);
      console.error(`   Failed pings: ${this.failedPings}`);
      
      if (this.failedPings >= 3) {
        console.error(`   ⚠️  WARNING: ${this.failedPings} consecutive failed pings!`);
        console.error(`   Server may be down or unreachable.\n`);
      } else {
        console.log(`   Will retry in 14 minutes\n`);
      }
    }
  }

  /**
   * Get the next scheduled ping time
   */
  getNextPingTime() {
    if (!this.lastPing) return 'Soon';
    
    const next = new Date(this.lastPing.getTime() + 14 * 60 * 1000);
    return next.toLocaleTimeString();
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      serverUrl: this.serverUrl,
      pingCount: this.pingCount,
      failedPings: this.failedPings,
      lastPing: this.lastPing,
      nextPing: this.getNextPingTime()
    };
  }
}

const keepAliveService = new KeepAliveService();

export default keepAliveService;
