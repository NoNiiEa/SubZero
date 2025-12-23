// src/instrumentation.ts

export async function register() {
    // This ensures the code only runs on the server (Node.js), not in the browser
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        
        // We import the DB logic dynamically here to avoid 
        // issues during the build process
        const { initDb } = await import('@/lib/db');
        
        console.log('🏁 Starting Database Initialization...');
        await initDb();
    }
}