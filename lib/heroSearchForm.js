/**
 * Hero Search Form Handler
 * Handles form submission and data persistence to search properties page
 */

export class HeroSearchForm {
  constructor(formElement) {
    this.form = formElement;
    this.locationInput = formElement.querySelector('input[name="location"]');
    this.checkinInput = formElement.querySelector('input[name="checkin"]');
    this.checkoutInput = formElement.querySelector('input[name="checkout"]');
    this.guestsInput = formElement.querySelector('input[name="guests"]');
    this.submitButton = formElement.querySelector('button[type="submit"], .search-input-enter-button');
    
    this.init();
  }

  init() {
    this.setupDateDefaults();
    this.setupValidation();
    this.setupFormSubmission();
    this.setupAccessibility();
  }

  setupDateDefaults() {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    
    // Format date for input
    const formatDate = (date) => date.toISOString().slice(0, 10);
    
    // Set minimum dates
    this.checkinInput.min = formatDate(today);
    this.checkoutInput.min = formatDate(tomorrow);
    
    // Set default values if not already set
    if (!this.checkinInput.value) {
      this.checkinInput.value = formatDate(tomorrow);
    }
    if (!this.checkoutInput.value) {
      const dayAfterTomorrow = new Date(tomorrow.getTime() + 86400000);
      this.checkoutInput.value = formatDate(dayAfterTomorrow);
    }
    
    // Ensure checkout is always after checkin
    this.checkinInput.addEventListener('change', () => {
      const checkinDate = new Date(this.checkinInput.value);
      const minCheckout = new Date(checkinDate.getTime() + 86400000);
      
      if (new Date(this.checkoutInput.value) <= checkinDate) {
        this.checkoutInput.value = formatDate(minCheckout);
      }
      this.checkoutInput.min = formatDate(minCheckout);
    });
  }

  setupValidation() {
    // Real-time validation
    [this.locationInput, this.checkinInput, this.checkoutInput, this.guestsInput].forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Form submission validation
    this.form.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
        this.showFormErrors();
      }
    });
  }

  validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (input.name) {
      case 'location':
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'Please enter a valid location';
        }
        break;
      case 'checkin':
        const checkinDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (checkinDate < today) {
          isValid = false;
          errorMessage = 'Check-in date cannot be in the past';
        }
        break;
      case 'checkout':
        const checkoutDate = new Date(value);
        const checkinDateValue = new Date(this.checkinInput.value);
        if (checkoutDate <= checkinDateValue) {
          isValid = false;
          errorMessage = 'Check-out date must be after check-in date';
        }
        break;
      case 'guests':
        const guestCount = parseInt(value);
        if (isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
          isValid = false;
          errorMessage = 'Please enter a valid number of guests (1-20)';
        }
        break;
    }

    this.setFieldValidation(input, isValid, errorMessage);
    return isValid;
  }

  setFieldValidation(input, isValid, errorMessage) {
    input.setAttribute('aria-invalid', !isValid);
    
    if (!isValid) {
      input.classList.add('error');
      input.setAttribute('aria-describedby', `${input.name}-error`);
      
      // Create or update error message
      let errorElement = document.getElementById(`${input.name}-error`);
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${input.name}-error`;
        errorElement.className = 'field-error';
        errorElement.setAttribute('role', 'alert');
        input.parentNode.insertBefore(errorElement, input.nextSibling);
      }
      errorElement.textContent = errorMessage;
    } else {
      input.classList.remove('error');
      const errorElement = document.getElementById(`${input.name}-error`);
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  clearFieldError(input) {
    input.classList.remove('error');
    const errorElement = document.getElementById(`${input.name}-error`);
    if (errorElement) {
      errorElement.remove();
    }
  }

  validateForm() {
    const fields = [this.locationInput, this.checkinInput, this.checkoutInput, this.guestsInput];
    let isFormValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  showFormErrors() {
    // Focus first invalid field
    const firstInvalidField = this.form.querySelector('input[aria-invalid="true"]');
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });

    // Also handle button clicks
    if (this.submitButton) {
      this.submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }
  }

  handleFormSubmission() {
    if (!this.validateForm()) {
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    // Build search parameters
    const searchParams = new URLSearchParams({
      q: this.locationInput.value.trim(),
      checkin: this.checkinInput.value,
      checkout: this.checkoutInput.value,
      numberOfAdults: this.guestsInput.value || '1',
      numberOfChildren: '0',
      numberOfInfants: '0',
      numberOfPets: '0'
    });

    // Store in session storage for persistence
    sessionStorage.setItem('searchFilters', JSON.stringify({
      destination: this.locationInput.value.trim(),
      checkin: this.checkinInput.value,
      checkout: this.checkoutInput.value,
      numberOfAdults: parseInt(this.guestsInput.value) || 1,
      numberOfChildren: 0,
      numberOfInfants: 0,
      numberOfPets: 0
    }));

    // Navigate to search page
    const searchUrl = `/search-properties?${searchParams.toString()}`;
    
    // Use a small delay to show loading state
    setTimeout(() => {
      window.location.href = searchUrl;
    }, 300);
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitButton.classList.add('loading');
      this.submitButton.disabled = true;
      this.submitButton.textContent = 'Searching...';
    } else {
      this.submitButton.classList.remove('loading');
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Search';
    }
  }

  setupAccessibility() {
    // Add ARIA labels and descriptions
    this.locationInput.setAttribute('aria-label', 'Search location');
    this.checkinInput.setAttribute('aria-label', 'Check-in date');
    this.checkoutInput.setAttribute('aria-label', 'Check-out date');
    this.guestsInput.setAttribute('aria-label', 'Number of guests');

    // Add form role
    this.form.setAttribute('role', 'search');
    this.form.setAttribute('aria-label', 'Search for vacation rentals');

    // Keyboard navigation
    this.form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        this.handleFormSubmission();
      }
    });
  }

  // Public method to populate form from URL parameters
  populateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('q')) {
      this.locationInput.value = urlParams.get('q');
    }
    if (urlParams.get('checkin')) {
      this.checkinInput.value = urlParams.get('checkin');
    }
    if (urlParams.get('checkout')) {
      this.checkoutInput.value = urlParams.get('checkout');
    }
    if (urlParams.get('numberOfAdults')) {
      this.guestsInput.value = urlParams.get('numberOfAdults');
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.guest-hero-search');
  if (searchForm) {
    window.heroSearchForm = new HeroSearchForm(searchForm);
    
    // Populate from URL if on homepage
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      window.heroSearchForm.populateFromURL();
    }
  }
});

// Export for module usage
export default HeroSearchForm;
