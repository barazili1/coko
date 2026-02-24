import { Platform } from '../types';

const BASE_URL = "https://evoioi-default-rtdb.europe-west1.firebasedatabase.app";

export const fetchCrashOdd = async (): Promise<number | null> => {
  try {
    const response = await fetch(`${BASE_URL}/pre/hipr/hipr.json`);
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    const odd = Number(data);
    return isNaN(odd) ? null : odd;
  } catch (error) {
    console.error("Error fetching crash odd from Firebase:", error);
    return null;
  }
};

export const fetchNotifications = async (): Promise<Record<string, any> | null> => {
  try {
    const response = await fetch(`${BASE_URL}/note.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications from Firebase:", error);
    return null;
  }
};

/**
 * m1 represents the bottom-left apple (Row 0, Col 0).
 * m50 represents the top-right apple (Row 9, Col 4).
 * Values: "0" = True Apple (Good), "1" = Rotten Apple (Bad).
 */
export const fetchAppleGridData = async (platform: Platform): Promise<boolean[][] | null> => {
  try {
    // Both platforms now sync from 'm11' as per user request
    const path = 'm11';
    const response = await fetch(`${BASE_URL}/${path}.json`);
    if (!response.ok) return null;
    const data = await response.json();
    
    if (!data) return null;

    // Initialize 10 rows (bottom to top) x 5 columns (left to right)
    const grid: boolean[][] = Array(10).fill(null).map(() => Array(5).fill(false));

    /**
     * Mapping m1 to m50:
     * i = 1: idx=0, row=0 (Bottom), col=0 (Left) -> m1
     * i = 5: idx=4, row=0 (Bottom), col=4 (Right) -> m5
     * i = 46: idx=45, row=9 (Top), col=0 (Left) -> m46
     * i = 50: idx=49, row=9 (Top), col=4 (Right) -> m50
     */
    for (let i = 1; i <= 50; i++) {
        const key = `m${i}`;
        const entry = data[key]; 
        
        if (entry !== undefined && entry !== null) {
            // Some Firebase formats wrap the value in a sub-object: { "m1": "0" }
            const valStr = (typeof entry === 'object' && entry[key] !== undefined) ? entry[key] : entry; 
            
            if (valStr !== undefined) {
                // Logic: "0" is Good (True), "1" is Rotten (Bad)
                const isGood = String(valStr) === "0";
                
                const idx = i - 1;
                const row = Math.floor(idx / 5);
                const col = idx % 5;
                
                if (row < 10 && col < 5) {
                    grid[row][col] = isGood;
                }
            }
        }
    }
    return grid;
  } catch (error) {
    console.error("Apple Grid Fetch Error:", error);
    return null;
  }
};

export const updateAppleGridData = async (platform: Platform): Promise<boolean> => {
  try {
    // Both platforms now sync to 'm11' as per user request
    const path = 'm11';
    const newData: Record<string, any> = {};

    const setRowData = (start: number, end: number, badCount: number) => {
      const keys: string[] = [];
      for (let i = start; i <= end; i++) keys.push(`m${i}`);
      
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }

      const badKeys = new Set(keys.slice(0, badCount));

      for (let i = start; i <= end; i++) {
        const key = `m${i}`;
        // "1" for Rotten, "0" for True Apple
        const val = badKeys.has(key) ? "1" : "0";
        newData[key] = { [key]: val };
      }
    };

    // Standard game logic for row difficulty
    setRowData(1, 5, 1);
    setRowData(6, 10, 1);
    setRowData(11, 15, 1);
    setRowData(16, 20, 1);
    setRowData(21, 25, 2);
    setRowData(26, 30, 2);
    setRowData(31, 35, 2);
    setRowData(36, 40, 3);
    setRowData(41, 45, 3);
    setRowData(46, 50, 4);

    const response = await fetch(`${BASE_URL}/${path}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    });
    return response.ok;
  } catch (e) {
    console.error("Error updating Apple Grid Data:", e);
    return false;
  }
};