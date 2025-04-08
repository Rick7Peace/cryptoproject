export interface PasswordValidationOptions {
    required?: boolean;
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  }
  
  /**
   * Validation result interface
   */
  export interface ValidationResult {
    valid: boolean;
    message: string;
  }
  
  /**
   * Validate email format
   * @param email The email to validate
   * @param options Validation options
   * @returns Validation result with validity status and error message if any
   */
  export const validateEmail = (
    email: string, 
    options: EmailValidationOptions = { required: true }
  ): ValidationResult => {
    if (!email && options.required) {
      return { valid: false, message: 'Email is required' };
    }
  
    if (!email && !options.required) {
      return { valid: true, message: '' };
    }
  
    // RFC 5322 compliant regex for email validation
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }
  
    return { valid: true, message: '' };
  };
  
  /**
   * Validate password strength and requirements
   * @param password The password to validate
   * @param options Validation options
   * @returns Validation result with validity status and error message if any
   */
  export const validatePassword = (
    password: string,
    options: PasswordValidationOptions = {
      required: true,
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    }
  ): ValidationResult => {
    if (!password && options.required) {
      return { valid: false, message: 'Password is required' };
    }
  
    if (!password && !options.required) {
      return { valid: true, message: '' };
    }
  
    const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = options;
  
    if (minLength && password.length < minLength) {
      return {
        valid: false,
        message: `Password must be at least ${minLength} characters long`,
      };
    }
  
    if (requireUppercase && !/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter',
      };
    }
  
    if (requireLowercase && !/[a-z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one lowercase letter',
      };
    }
  
    if (requireNumbers && !/[0-9]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one number',
      };
    }
  
    if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one special character',
      };
    }
  
    return { valid: true, message: '' };
  };
  
  /**
   * Validate password confirmation
   * @param password The original password
   * @param confirmPassword The confirmation password
   * @returns Validation result with validity status and error message if any
   */
  export const validatePasswordConfirmation = (
    password: string,
    confirmPassword: string
  ): ValidationResult => {
    if (!confirmPassword) {
      return { valid: false, message: 'Please confirm your password' };
    }
  
    if (password !== confirmPassword) {
      return { valid: false, message: 'Passwords do not match' };
    }
  
    return { valid: true, message: '' };
  };
  
  /**
   * Validate login form
   * @param email User email
   * @param password User password
   * @returns Object with validation status and field-specific errors
   */
  export const validateLoginForm = (email: string, password: string) => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password, { 
      required: true,
      minLength: 1,  // Just check existence for login
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false
    });
  
    const isValid = emailValidation.valid && passwordValidation.valid;
  
    return {
      isValid,
      errors: {
        email: emailValidation.message,
        password: passwordValidation.message,
      },
    };
  };
  
  /**
   * Validate registration form
   * @param email User email
   * @param password User password
   * @param confirmPassword Password confirmation
   * @param username Optional username
   * @returns Object with validation status and field-specific errors
   */
  export const validateRegistrationForm = (
    email: string,
    password: string,
    confirmPassword: string,
    username?: string 
  ) => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
    
    const usernameValidation = !username ? { valid: true, message: '' } : 
      (username.length < 3 ? 
        { valid: false, message: 'Username must be at least 3 characters long' } : 
        { valid: true, message: '' });
  
    const isValid = emailValidation.valid && 
      passwordValidation.valid && 
      confirmValidation.valid &&
      usernameValidation.valid;
  
    return {
      isValid,
      errors: {
        email: emailValidation.message,
        password: passwordValidation.message,
        confirmPassword: confirmValidation.message,
        username: usernameValidation.message,
      },
    };
  };
  
  /**
   * Validate password reset request form (forgot password)
   * @param email User email
   * @returns Object with validation status and field-specific errors
   */
  export const validateForgotPasswordForm = (email: string) => {
    const emailValidation = validateEmail(email);
  
    return {
      isValid: emailValidation.valid,
      errors: {
        email: emailValidation.message,
      },
    };
  };
  
  /**
   * Validate password reset form
   * @param password New password
   * @param confirmPassword Password confirmation
   * @returns Object with validation status and field-specific errors
   */
  export const validatePasswordResetForm = (password: string, confirmPassword: string) => {
    const passwordValidation = validatePassword(password);
    const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
  
    const isValid = passwordValidation.valid && confirmValidation.valid;
  
    return {
      isValid,
      errors: {
        password: passwordValidation.message,
        confirmPassword: confirmValidation.message,
      },
    };
  };
  
  /**
   * Get password strength indicator (1-5)
   * @param password The password to evaluate
   * @returns Number from 1-5 indicating password strength
   */
  export const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length contribution
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character types contribution
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;
    
    return Math.min(5, strength);
  };