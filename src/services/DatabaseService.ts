
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

export interface LeafMeasurement {
  id?: number;
  imageUri: string;
  leafArea: number;
  calibrationArea: number;
  greenPixelCount: number;
  redPixelCount: number;
  timestamp: number;
  notes?: string;
}

export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private initialized = false;

  constructor() {
    this.sqlite = new SQLiteConnection();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Fix 1: Add required argument to checkConnectionsConsistency
      await this.sqlite.checkConnectionsConsistency("transaction");
      
      // Fix 2: Provide all 5 required arguments to createConnection
      this.db = await this.sqlite.createConnection('leaf_measurements', false, 'no-encryption', 1, false);
      
      if (this.db) {
        await this.db.open();
        
        // Create tables if they don't exist
        const query = `
          CREATE TABLE IF NOT EXISTS leaf_measurements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imageUri TEXT NOT NULL,
            leafArea REAL NOT NULL,
            calibrationArea REAL NOT NULL,
            greenPixelCount INTEGER NOT NULL,
            redPixelCount INTEGER NOT NULL,
            timestamp INTEGER NOT NULL,
            notes TEXT
          );
        `;
        
        await this.db.execute(query);
        this.initialized = true;
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async saveMeasurement(measurement: LeafMeasurement): Promise<number> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const statement = `
      INSERT INTO leaf_measurements 
      (imageUri, leafArea, calibrationArea, greenPixelCount, redPixelCount, timestamp, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      measurement.imageUri,
      measurement.leafArea,
      measurement.calibrationArea,
      measurement.greenPixelCount,
      measurement.redPixelCount,
      measurement.timestamp,
      measurement.notes || null
    ];

    const result = await this.db.run(statement, values);
    return result.changes?.lastId || -1;
  }

  async getMeasurements(): Promise<LeafMeasurement[]> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'SELECT * FROM leaf_measurements ORDER BY timestamp DESC';
    const result = await this.db.query(query);
    
    return result.values || [];
  }

  async getMeasurementById(id: number): Promise<LeafMeasurement | null> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'SELECT * FROM leaf_measurements WHERE id = ?';
    const result = await this.db.query(query, [id]);
    
    if (result.values && result.values.length > 0) {
      return result.values[0] as LeafMeasurement;
    }
    
    return null;
  }

  async deleteMeasurement(id: number): Promise<void> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'DELETE FROM leaf_measurements WHERE id = ?';
    await this.db.run(query, [id]);
  }

  async closeConnection(): Promise<void> {
    if (this.db) {
      // Fix 3: Provide both required arguments for closeConnection
      await this.sqlite.closeConnection('leaf_measurements', false);
      this.db = null;
      this.initialized = false;
    }
  }
}

export const databaseService = new DatabaseService();
