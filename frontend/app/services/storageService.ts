/**
 * Service to centralize and standardize local storage operations
 */
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'user',
    AUTH_TIMESTAMP: 'authTimestamp'
  };
  
  let memoryAccessToken: string | null = null;
  let memoryRefreshToken: string | null = null;
  let memoryUserData: any = null;
  let memoryAuthTimestamp: number | null = null;

  export const storageService = {
    /**
     * Set authentication data in local storage
     */
    setAuthData(accessToken: string, refreshToken: string, userData: any): void {
      try {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.AUTH_TIMESTAMP, Date.now().toString());
      } catch (error) {
        console.error('Failed to store auth data:', error);
        // Consider showing a notification to user
      }
    },
  
    /**
     * Clear all authentication data
     */
    clearAuthData(): void {
      try {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
      } catch (error) {
        console.error('Failed to clear auth data:', error);
      }
    },
  
    
    /**
     * Get stored authentication data
     */
    getAuthData(): { accessToken: string | null, refreshToken: string | null, user: any, timestamp: number | null } {
        try {
          // Try localStorage first
          const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null');
          const timestamp = Number(localStorage.getItem(STORAGE_KEYS.AUTH_TIMESTAMP)) || null;
          
          // Update memory fallbacks
          memoryAccessToken = accessToken;
          memoryRefreshToken = refreshToken;
          memoryUserData = userData;
          memoryAuthTimestamp = timestamp;
          
          return { accessToken, refreshToken, user: userData, timestamp };
        } catch (error) {
          console.error('Failed to retrieve auth data from localStorage, using memory fallback:', error);
          // Return memory fallback values
          return { 
            accessToken: memoryAccessToken, 
            refreshToken: memoryRefreshToken, 
            user: memoryUserData, 
            timestamp: memoryAuthTimestamp 
          };
        }
      },
  
    /**
   * Update the authentication timestamp
   */
  updateAuthTimestamp(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error('Failed to update auth timestamp:', error);
    }
  },
    
    /**
     * Check if storage is available
     */
    isStorageAvailable(): boolean {
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    },
  
    /**
     * Update specific user data fields
     */
    updateUserData(userData: Partial<any>): void {
      try {
        const currentData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null') || {};
        const updatedData = { ...currentData, ...userData };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedData));
      } catch (error) {
        console.error('Failed to update user data:', error);
      }
    }
  };
  
  export default storageService;