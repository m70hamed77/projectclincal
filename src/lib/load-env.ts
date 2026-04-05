import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env file explicitly
export function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env')
    const envContent = readFileSync(envPath, 'utf8')
    const envVars: Record<string, string> = {}
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '')
        envVars[key.trim()] = cleanValue
      }
    })
    
    return envVars
  } catch (error) {
    console.error('Failed to load .env file:', error)
    return {}
  }
}

// Get DATABASE_URL from .env file
export function getDatabaseUrl(): string {
  // First try system environment variable
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL
  }
  
  // Then load from .env file
  const envVars = loadEnvFile()
  return envVars.DATABASE_URL || process.env.DATABASE_URL || ''
}
