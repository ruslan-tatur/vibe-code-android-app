import * as SQLite from 'expo-sqlite';


import { Goal } from './types';

// Database connection will be initialized during app startup
let db: SQLite.SQLiteDatabase;

// Separate initialization function
const initializeDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('goals.db');

    await createTables();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);

    throw error;
  }
}

// Create tables function
async function createTables(): Promise<void> {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        progress INTEGER,
        endDate TEXT
      );
    `);
    console.log('Goals table created successfully');
  } catch (error) {
    console.error('Error creating goals table:', error);
    throw error;
  }
}

class GoalsService {
  async getGoals(): Promise<Goal[]> {
    try {
      const result = await db.getAllAsync<Goal>('SELECT * FROM goals');
      return result.map((goal: Goal) => ({
        ...goal,
        // Convert stored date string back to Date object if it exists
        endDate: goal.endDate ? new Date(goal.endDate) : undefined
      }));
    } catch (error) {
      console.error('Error getting goals:', error);
      throw error;
    }
  }

  async saveGoal(goal: Goal): Promise<number> {
    try {
      if (goal.id) {
        // Update existing goal
        await db.runAsync(
          `UPDATE goals 
           SET name = ?, type = ?, progress = ?, endDate = ?
           WHERE id = ?`,
          [
            goal.name,
            goal.type,
            goal.progress || null,
            goal.endDate?.toISOString() || null,
            goal.id
          ]
        );
        return goal.id;
      } else {
        // Insert new goal
        const result = await db.runAsync(
          `INSERT INTO goals (name, type, progress, endDate)
           VALUES (?, ?, ?, ?)`,
          [
            goal.name,
            goal.type,
            goal.progress || null,
            goal.endDate?.toISOString() || null
          ]
        );
        return result.lastInsertRowId;
      }
    } catch (error) {
      console.error('Error saving goal:', error);
      throw error;
    }
  }
}

const goalsService = new GoalsService();

export { initializeDatabase, goalsService };
