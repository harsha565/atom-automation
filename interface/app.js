/**
 * BEE - WHATSAPP BUSINESS ONBOARDING SYSTEM
 * Core JavaScript SPA state controller, client-side router, form validation,
 * mock Meta integration, activity filters, and session controllers.
 */

(function() {
  'use strict';

  // ==========================================================================
  // 1. STATE CONFIGURATION
  // ==========================================================================
  const BEE = {
    state: {
      authenticated: false,
      user: null, // { name: '', businessName: '', email: '' }
      connection: {
        isConnected: false,
        wabaName: '',
        phoneNumber: '',
        connectedAt: '',
        lastSync: null, // Date object or string
        status: 'Inactive' // 'Active', 'Inactive', 'Connecting', 'Error'
      },
      logs: [
        { id: 1, type: 'SUCCESS', title: 'Account Onboarding Verified', desc: 'Secure connection parameters validated by Meta compliance engines.', time: '2 hours ago' },
        { id: 2, type: 'SUCCESS', title: 'Meta Login Handshake Authorized', desc: 'Permission profiles linked using secure credentials.', time: '2 hours ago' },
        { id: 3, type: 'WARNING', title: 'Verification Logs Synced', desc: 'System log sync initialized for business account profile.', time: '3 hours ago' },
        { id: 4, type: 'SUCCESS', title: 'BEE Portal Profile Activated', desc: 'Verification tracking dashboard activated for business owner.', time: '4 hours ago' }
      ],
      tickets: [],
      idleTimer: null,
      countdownTimer: null,
      countdownValue: 120,
      authChannel: null
    },

    // Initialize core application listeners
    init: function() {
      // Restore session storage if exists
      this.restoreSession();

      // Initialize SPA routing
      window.addEventListener('hashchange', () => this.router());
      window.addEventListener('load', () => {
        this.languageGovernanceCheck();
        this.router();
      });

      // Bind global DOM selectors
      this.bindEvents();

      // Start inactive tracker if authenticated
      if (this.state.authenticated) {
        this.startInactivityTracker();
      }

      // Initialize cross-tab broadcast channel
      this.initBroadcastChannel();
    },

    // ==========================================================================
    // 2. REUSABLE UTILITIES
    // ==========================================================================
    setState: function(key, val) {
      this.state[key] = val;
      this.persistSession();
      
      // Update UI components depending on updated state keys
      if (key === 'authenticated') {
        this.updateNavbar();
        if (val) {
          this.startInactivityTracker();
        } else {
          this.stopInactivityTracker();
        }
      }
      if (key === 'connection' || key === 'user') {
        this.renderDashboard();
        this.renderSettings();
      }
    },

    // Session Persistence in sessionStorage
    persistSession: function() {
      sessionStorage.setItem('bee_session_auth', JSON.stringify({
        authenticated: this.state.authenticated,
        user: this.state.user,
        connection: this.state.connection
      }));
    },

    restoreSession: function() {
      const stored = sessionStorage.getItem('bee_session_auth');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.state.authenticated = parsed.authenticated || false;
          this.state.user = parsed.user || null;
          this.state.connection = parsed.connection || { isConnected: false, wabaName: '', phoneNumber: '', connectedAt: '', lastSync: null, status: 'Inactive' };
        } catch (e) {
          console.error("Error restoring session parameters:", e);
        }
      }
    },

    initBroadcastChannel: function() {
      try {
        this.state.authChannel = new BroadcastChannel('bee_auth_sync');
        this.state.authChannel.onmessage = (event) => {
          if (event.data === 'LOGOUT') {
            this.handleLogout(true); // silent logout trigger
          } else if (event.data === 'LOGIN') {
            // Reload page to restore state synced to sessionStorage
            location.reload();
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel not supported in current environment.");
      }
    },

    // ==========================================================================
    // 3. CLIENT SIDE HASH ROUTER
    // ==========================================================================
    router: function() {
      const hash = window.location.hash || '#/';
      const views = document.querySelectorAll('.view');
      
      // Hide all active views
      views.forEach(v => v.classList.remove('active'));

      // Close mobile navigation drawer if open
      const navMenu = document.getElementById('nav-authenticated-links');
      
      // Clear navigation active links style
      document.querySelectorAll('.navbar-link').forEach(link => link.classList.remove('active'));

      // Check route guards (Support is now public!)
      const protectedRoutes = ['#/dashboard', '#/connect', '#/success', '#/permissions', '#/activity', '#/settings'];
      if (protectedRoutes.includes(hash) && !this.state.authenticated) {
        window.location.hash = '#/login';
        this.showToast('Security Access Restricted', 'Please sign in to access your business verification portal.', 'warning');
        return;
      }

      // Handle individual view matching
      if (hash === '#/' || hash === '#/landing-learn-more') {
        document.getElementById('view-landing').classList.add('active');
        document.getElementById('nav-link-home')?.classList.add('active');
        
        // Scroll to learn more if targeted
        if (hash === '#/landing-learn-more') {
          setTimeout(() => {
            document.getElementById('landing-learn-more')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else if (hash === '#/login') {
        if (this.state.authenticated) {
          window.location.hash = '#/dashboard';
          return;
        }
        document.getElementById('view-login').classList.add('active');
      } else if (hash === '#/signup') {
        if (this.state.authenticated) {
          window.location.hash = '#/dashboard';
          return;
        }
        document.getElementById('view-signup').classList.add('active');
      } else if (hash === '#/dashboard') {
        document.getElementById('view-dashboard').classList.add('active');
        document.getElementById('nav-link-dashboard')?.classList.add('active');
        this.renderDashboard();
      } else if (hash === '#/connect') {
        if (this.state.connection.isConnected) {
          window.location.hash = '#/dashboard';
          return;
        }
        document.getElementById('view-connect').classList.add('active');
      } else if (hash === '#/success') {
        if (!this.state.connection.isConnected) {
          window.location.hash = '#/connect';
          return;
        }
        document.getElementById('view-success').classList.add('active');
        this.renderSuccessPage();
      } else if (hash === '#/permissions') {
        document.getElementById('view-permissions').classList.add('active');
        document.getElementById('nav-link-permissions')?.classList.add('active');
      } else if (hash === '#/activity') {
        document.getElementById('view-activity').classList.add('active');
        document.getElementById('nav-link-activity')?.classList.add('active');
        this.renderActivityLogs();
      } else if (hash === '#/settings') {
        document.getElementById('view-settings').classList.add('active');
        document.getElementById('nav-link-settings')?.classList.add('active');
        this.renderSettings();
        
        // Handle direct sub-tab routing via query params
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const tab = urlParams.get('tab');
        if (tab) {
          this.switchSettingsTab(tab);
        }
      } else if (hash === '#/support') {
        document.getElementById('view-support').classList.add('active');
        document.getElementById('nav-link-support-pub')?.classList.add('active');
        document.getElementById('nav-link-support-auth')?.classList.add('active');
        this.renderSupport();
      } else {
        // Fallback to landing
        document.getElementById('view-landing').classList.add('active');
      }

      // Scroll window to top
      window.scrollTo(0, 0);

      // Trigger language governance checks on loaded templates
      this.languageGovernanceCheck();
    },

    updateNavbar: function() {
      const publicLinks = document.getElementById('nav-public-links');
      const authLinks = document.getElementById('nav-authenticated-links');
      const unauthActions = document.getElementById('nav-unauth-actions');
      const authActions = document.getElementById('nav-auth-actions');

      if (this.state.authenticated) {
        if (publicLinks) publicLinks.style.display = 'none';
        if (authLinks) authLinks.style.display = 'flex';
        if (unauthActions) unauthActions.style.display = 'none';
        if (authActions) authActions.style.display = 'flex';
        
        // Update user avatar initials
        const nameVal = this.state.user ? this.state.user.name : 'Owner';
        const initials = nameVal.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const avatarEl = document.getElementById('user-display-avatar');
        const nameEl = document.getElementById('user-display-name');
        
        if (avatarEl) avatarEl.textContent = initials || 'U';
        if (nameEl) nameEl.textContent = this.state.user ? this.state.user.businessName : 'My Business';
      } else {
        if (publicLinks) publicLinks.style.display = 'flex';
        if (authLinks) authLinks.style.display = 'none';
        if (unauthActions) unauthActions.style.display = 'flex';
        if (authActions) authActions.style.display = 'none';
      }
    },

    // ==========================================================================
    // 4. VIEW RENDERING METHODS
    // ==========================================================================
    renderDashboard: function() {
      // Welcome messaging
      const welcomeEl = document.getElementById('dashboard-welcome');
      if (welcomeEl && this.state.user) {
        welcomeEl.textContent = `Welcome back, ${this.state.user.name}`;
      }

      // Check current connection state
      const progressHeader = document.getElementById('dashboard-onboarding-progress');
      const disCard = document.getElementById('card-disconnected-state');
      const conCard = document.getElementById('card-connected-state');

      if (this.state.connection.isConnected) {
        // Hide onboarding steps progress header
        if (progressHeader) progressHeader.style.display = 'none';
        if (disCard) disCard.style.display = 'none';
        if (conCard) conCard.style.display = 'block';

        // Update WABA Details
        const nameEl = document.getElementById('connected-waba-business-name');
        const numEl = document.getElementById('connected-waba-number');
        const syncLabel = document.getElementById('lbl-last-sync');
        const tableWabaName = document.getElementById('table-waba-business-name');
        const tableWabaPhone = document.getElementById('table-waba-phone');

        if (nameEl) nameEl.textContent = this.state.connection.wabaName;
        if (numEl) numEl.textContent = `Linked Number: ${this.state.connection.phoneNumber}`;
        if (tableWabaName) tableWabaName.textContent = this.state.connection.wabaName;
        if (tableWabaPhone) tableWabaPhone.textContent = this.state.connection.phoneNumber;
        if (syncLabel) {
          syncLabel.textContent = this.state.connection.lastSync ? this.state.connection.lastSync : 'Just now';
        }
      } else {
        // Show onboarding progress steps
        if (progressHeader) progressHeader.style.display = 'block';
        if (disCard) disCard.style.display = 'block';
        if (conCard) conCard.style.display = 'none';

        // Adjust step markers based on onboarding progression
        const step2 = document.getElementById('progress-step-2');
        const step3 = document.getElementById('progress-step-3');
        const step4 = document.getElementById('progress-step-4');

        if (step2) {
          step2.style.opacity = '1';
          step2.style.borderColor = 'var(--text-primary)';
        }
        if (step3) {
          step3.style.opacity = '0.6';
          step3.style.borderColor = 'var(--border-color)';
        }
        if (step4) {
          step4.style.opacity = '0.6';
          step4.style.borderColor = 'var(--border-color)';
        }
      }

      // Populate mini logs on Dashboard side panel
      this.renderMiniLogs();
    },

    renderMiniLogs: function() {
      const container = document.getElementById('mini-log-container');
      if (!container) return;

      if (this.state.logs.length === 0) {
        container.innerHTML = `<p class="text-sm text-center" style="padding: 16px 0;">No activities registered.</p>`;
        return;
      }

      // Select top 3 recent logs
      const recents = this.state.logs.slice(0, 3);
      let html = '<ul style="list-style: none;">';
      recents.forEach(log => {
        const dotColor = log.type === 'SUCCESS' ? 'var(--success)' : (log.type === 'WARNING' ? 'var(--warning)' : 'var(--error)');
        html += `
          <li style="display: flex; gap: var(--space-sm); margin-bottom: 12px; align-items: flex-start;">
            <span style="background-color: ${dotColor}; width: 6px; height: 6px; border-radius: 50%; margin-top: 6px; flex-shrink:0;"></span>
            <div>
              <strong style="font-size: 0.8125rem; color: var(--text-primary); display:block; line-height:1.2;">${log.title}</strong>
              <p style="font-size: 0.75rem; color: var(--text-secondary); line-height:1.3; margin-top:2px;">${log.desc}</p>
              <span style="font-size: 0.6875rem; color: var(--text-muted);">${log.time}</span>
            </div>
          </li>
        `;
      });
      html += '</ul>';
      container.innerHTML = html;
    },

    renderSuccessPage: function() {
      const nameEl = document.getElementById('success-display-business-name');
      const numEl = document.getElementById('success-display-number');
      const dateEl = document.getElementById('success-display-date');

      if (nameEl) nameEl.textContent = this.state.connection.wabaName;
      if (numEl) numEl.textContent = this.state.connection.phoneNumber;
      if (dateEl) dateEl.textContent = this.state.connection.connectedAt;
    },

    renderActivityLogs: function() {
      const timeline = document.getElementById('log-timeline-container');
      const emptyState = document.getElementById('log-empty-state');
      const searchVal = document.getElementById('log-search')?.value.toLowerCase() || '';
      const filterVal = document.getElementById('log-filter-status')?.value || 'ALL';

      if (!timeline) return;

      // Filter local memory log array
      const filtered = this.state.logs.filter(log => {
        const matchesSearch = log.title.toLowerCase().includes(searchVal) || log.desc.toLowerCase().includes(searchVal);
        const matchesFilter = filterVal === 'ALL' || log.type === filterVal;
        return matchesSearch && matchesFilter;
      });

      if (filtered.length === 0) {
        timeline.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
      } else {
        timeline.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';

        let html = '';
        filtered.forEach(log => {
          let badgeClass = 'badge-neutral';
          let dotColor = 'var(--text-secondary)';
          if (log.type === 'SUCCESS') {
            badgeClass = 'badge-success';
            dotColor = 'success';
          } else if (log.type === 'WARNING') {
            badgeClass = 'badge-warning';
            dotColor = 'warning';
          } else if (log.type === 'ERROR') {
            badgeClass = 'badge-error';
            dotColor = 'error';
          }

          html += `
            <div class="timeline-item">
              <span class="timeline-dot ${dotColor}"></span>
              <div class="card" style="padding: 16px; margin-left: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: var(--space-xs);">
                  <div>
                    <h4 style="font-size: 0.875rem; margin-bottom: 2px;">${log.title}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${log.time}</span>
                  </div>
                  <span class="badge ${badgeClass}" style="padding: 2px 8px; font-size: 9px;">${log.type}</span>
                </div>
                <p class="text-sm" style="margin-bottom: 0; line-height: 1.4;">${log.desc}</p>
              </div>
            </div>
          `;
        });
        timeline.innerHTML = html;
      }
    },

    renderSettings: function() {
      // Load form details if user exists
      if (this.state.user) {
        const nameEl = document.getElementById('set-business-name');
        const ownerEl = document.getElementById('set-owner-name');
        const emailEl = document.getElementById('set-email');
        if (nameEl) nameEl.value = this.state.user.businessName;
        if (ownerEl) ownerEl.value = this.state.user.name;
        if (emailEl) emailEl.value = this.state.user.email;
      }

      // Render WhatsApp link block inside Settings
      const wabaConnectedPanel = document.getElementById('settings-waba-connected-view');
      const wabaDisconnectedPanel = document.getElementById('settings-waba-disconnected-view');

      if (this.state.connection.isConnected) {
        if (wabaConnectedPanel) wabaConnectedPanel.style.display = 'block';
        if (wabaDisconnectedPanel) wabaDisconnectedPanel.style.display = 'none';

        const titleEl = document.getElementById('settings-waba-business-name');
        const subtitleEl = document.getElementById('settings-waba-number');
        if (titleEl) titleEl.textContent = this.state.connection.wabaName;
        if (subtitleEl) subtitleEl.textContent = this.state.connection.phoneNumber;
      } else {
        if (wabaConnectedPanel) wabaConnectedPanel.style.display = 'none';
        if (wabaDisconnectedPanel) wabaDisconnectedPanel.style.display = 'block';
      }
    },

    switchSettingsTab: function(tabName) {
      // Remove active classes
      const tabs = document.querySelectorAll('.tab-btn');
      const contents = document.querySelectorAll('.tab-content');
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active to targeted tab
      const targetTab = document.getElementById(`tab-btn-${tabName}`);
      const targetContent = document.getElementById(`tab-${tabName}`);
      if (targetTab && targetContent) {
        targetTab.classList.add('active');
        targetContent.classList.add('active');
      }
    },

    renderSupport: function() {
      const faqSearch = document.getElementById('faq-search')?.value.toLowerCase() || '';
      const items = document.querySelectorAll('.support-faq-item');

      items.forEach(item => {
        const text = item.querySelector('.accordion-header span').textContent.toLowerCase();
        const desc = item.querySelector('.accordion-content p').textContent.toLowerCase();
        if (text.includes(faqSearch) || desc.includes(faqSearch)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      // Contextual control over ticket creation
      const unauthWarn = document.getElementById('support-unauth-warning');
      const supportForm = document.getElementById('form-support-ticket');
      const submitBtn = document.getElementById('btn-support-submit');
      
      if (this.state.authenticated) {
        if (unauthWarn) unauthWarn.style.display = 'none';
        if (supportForm) {
          const inputs = supportForm.querySelectorAll('input, textarea');
          inputs.forEach(i => i.removeAttribute('disabled'));
        }
        if (submitBtn) submitBtn.removeAttribute('disabled');
      } else {
        if (unauthWarn) unauthWarn.style.display = 'block';
        if (supportForm) {
          const inputs = supportForm.querySelectorAll('input, textarea');
          inputs.forEach(i => i.setAttribute('disabled', 'true'));
        }
        if (submitBtn) submitBtn.setAttribute('disabled', 'true');
      }
    },

    // ==========================================================================
    // 5. EVENT BINDINGS & DOM CONTROLLER
    // ==========================================================================
    bindEvents: function() {
      const self = this;

      // Mobile navbar toggler
      const toggleBtn = document.getElementById('mobile-menu-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
          const publicLinks = document.getElementById('nav-public-links');
          const authLinks = document.getElementById('nav-authenticated-links');
          const activeNav = self.state.authenticated ? authLinks : publicLinks;
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !isExpanded);
          
          if (activeNav) {
            if (!isExpanded) {
              activeNav.style.display = 'flex';
              activeNav.style.flexDirection = 'column';
              activeNav.style.position = 'absolute';
              activeNav.style.top = '72px';
              activeNav.style.left = '0';
              activeNav.style.width = '100%';
              activeNav.style.backgroundColor = 'var(--card-bg)';
              activeNav.style.borderBottom = '1px solid var(--border-color)';
              activeNav.style.padding = '16px';
              activeNav.style.zIndex = 'var(--z-header)';
            } else {
              activeNav.style.display = self.state.authenticated ? 'none' : 'flex';
              activeNav.style.flexDirection = '';
              activeNav.style.position = '';
              activeNav.style.width = '';
              activeNav.style.backgroundColor = '';
              activeNav.style.borderBottom = '';
              activeNav.style.padding = '';
            }
          }
        });
      }

      // User Profile Dropdown toggler
      const profileBtn = document.getElementById('profile-dropdown-btn');
      const profileMenu = document.getElementById('profile-dropdown-menu');
      if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !isExpanded);
          profileMenu.classList.toggle('active');
        });

        document.addEventListener('click', function() {
          profileBtn.setAttribute('aria-expanded', 'false');
          profileMenu.classList.remove('active');
        });
      }

      // General interactive accordions
      document.addEventListener('click', function(e) {
        const header = e.target.closest('.accordion-header');
        if (header) {
          const accordion = header.closest('.accordion');
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          
          header.setAttribute('aria-expanded', !isExpanded);
          accordion.classList.toggle('active');
        }
      });

      // Settings Tab Button toggles
      const tabGroup = document.querySelector('.tab-container');
      if (tabGroup) {
        tabGroup.addEventListener('click', function(e) {
          const btn = e.target.closest('.tab-btn');
          if (btn) {
            const targetId = btn.getAttribute('aria-controls');
            const tabName = targetId.split('-')[1];
            self.switchSettingsTab(tabName);
            
            // Sync URL hash with query param
            history.replaceState(null, '', `#/settings?tab=${tabName}`);
          }
        });
      }

      // --- LOGIN FORM & SUBMIT VALIDATION ---
      const loginForm = document.getElementById('form-login');
      if (loginForm) {
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');

        emailInput.addEventListener('blur', () => this.validateEmail('login-email'));
        passInput.addEventListener('blur', () => this.validateRequired('login-password', 'Password is required.'));

        loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const isEmailVal = self.validateEmail('login-email');
          const isPassVal = self.validateRequired('login-password', 'Password is required.');

          if (isEmailVal && isPassVal) {
            const submitBtn = this.querySelector('button[type="submit"]');
            self.setButtonLoading(submitBtn, true, 'Signing In...');
            
            // Simulate Authentication delay
            setTimeout(() => {
              self.setButtonLoading(submitBtn, false);
              
              // Set mock user session
              self.setState('user', {
                name: 'Alex Johnson',
                businessName: 'Elite Fitness Gym',
                email: emailInput.value
              });
              self.setState('authenticated', true);
              
              // Broadcast session sync to other tabs
              self.state.authChannel?.postMessage('LOGIN');

              self.showToast('Login Successful', 'Welcome to your secure onboarding portal.', 'success');
              window.location.hash = '#/dashboard';
            }, 1000);
          }
        });
      }

      // --- SIGNUP FORM & COMPLEX PASSWORD METER ---
      const signupForm = document.getElementById('form-signup');
      if (signupForm) {
        const nameInput = document.getElementById('signup-owner-name');
        const bizInput = document.getElementById('signup-business-name');
        const emailInput = document.getElementById('signup-email');
        const passInput = document.getElementById('signup-password');
        const confirmInput = document.getElementById('signup-confirm-password');
        const agreeInput = document.getElementById('signup-agree');

        nameInput.addEventListener('blur', () => this.validateRequired('signup-owner-name', 'Owner name is required.'));
        bizInput.addEventListener('blur', () => this.validateRequired('signup-business-name', 'Business name is required.'));
        emailInput.addEventListener('blur', () => this.validateEmail('signup-email'));
        passInput.addEventListener('blur', () => this.validatePasswordStrength());
        confirmInput.addEventListener('blur', () => this.validateConfirmPassword());
        agreeInput.addEventListener('change', () => this.validateCheckbox('signup-agree', 'You must agree to the terms to continue.'));

        // Realtime Password Strength meter check
        passInput.addEventListener('input', function() {
          const strength = self.checkPasswordStrength(this.value);
          const bar1 = document.getElementById('pw-seg-1');
          const bar2 = document.getElementById('pw-seg-2');
          const bar3 = document.getElementById('pw-seg-3');
          const label = document.getElementById('pw-strength-label');

          // Reset segments colors
          bar1.style.backgroundColor = '';
          bar2.style.backgroundColor = '';
          bar3.style.backgroundColor = '';

          if (this.value.length === 0) {
            label.textContent = 'Password strength';
            return;
          }

          if (strength === 'WEAK') {
            bar1.style.backgroundColor = 'var(--error)';
            label.textContent = 'Weak password - Add numbers & special characters';
          } else if (strength === 'MEDIUM') {
            bar1.style.backgroundColor = 'var(--warning)';
            bar2.style.backgroundColor = 'var(--warning)';
            label.textContent = 'Medium password - Mix capital letters & symbols';
          } else if (strength === 'STRONG') {
            bar1.style.backgroundColor = 'var(--success)';
            bar2.style.backgroundColor = 'var(--success)';
            bar3.style.backgroundColor = 'var(--success)';
            label.textContent = 'Strong password - Excellent';
          }
        });

        signupForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const isName = self.validateRequired('signup-owner-name', 'Owner name is required.');
          const isBiz = self.validateRequired('signup-business-name', 'Business name is required.');
          const isEmail = self.validateEmail('signup-email');
          const isPass = self.validatePasswordStrength();
          const isConfirm = self.validateConfirmPassword();
          const isAgree = self.validateCheckbox('signup-agree', 'You must agree to the terms to continue.');

          if (isName && isBiz && isEmail && isPass && isConfirm && isAgree) {
            const submitBtn = this.querySelector('button[type="submit"]');
            self.setButtonLoading(submitBtn, true, 'Creating Account...');
            
            setTimeout(() => {
              self.setButtonLoading(submitBtn, false);
              
              // Set mock state
              self.setState('user', {
                name: nameInput.value,
                businessName: bizInput.value,
                email: emailInput.value
              });
              self.setState('authenticated', true);
              
              // Broadcast
              self.state.authChannel?.postMessage('LOGIN');

              self.showToast('Account Created Successfully', 'Your BEE session is ready. Proceed to link WhatsApp.', 'success');
              window.location.hash = '#/dashboard';
            }, 1200);
          }
        });
      }

      // --- LOGOUT ACTION TRIGGER ---
      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.handleLogout();
        });
      }

      // --- ACTIVITY LOG FILTER / SEARCH LISTENERS ---
      document.getElementById('log-search')?.addEventListener('input', () => this.renderActivityLogs());
      document.getElementById('log-filter-status')?.addEventListener('change', () => this.renderActivityLogs());
      
      const clearLogsBtn = document.getElementById('btn-clear-logs');
      if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', function() {
          self.state.logs = [];
          self.persistSession();
          self.renderActivityLogs();
          self.showToast('Logs Cleared', 'Handshake logs cleared from active viewport.', 'info');
        });
      }

      // --- SETTINGS FORM SUBMISSIONS ---
      const profileSettingsForm = document.getElementById('form-settings-profile');
      if (profileSettingsForm) {
        profileSettingsForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const nameEl = document.getElementById('set-business-name');
          const ownerEl = document.getElementById('set-owner-name');
          const emailEl = document.getElementById('set-email');

          self.setState('user', {
            name: ownerEl.value,
            businessName: nameEl.value,
            email: emailEl.value
          });

          self.showToast('Profile Updated', 'Business details verified and updated in BEE logs.', 'success');
        });
      }

      const securitySettingsForm = document.getElementById('form-settings-security');
      if (securitySettingsForm) {
        securitySettingsForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const curr = document.getElementById('sec-current-password');
          const nw = document.getElementById('sec-new-password');
          const conf = document.getElementById('sec-confirm-password');

          let valid = true;
          if (!curr.value) {
            self.setInputError('sec-current-password', 'Current password is required.');
            valid = false;
          } else {
            self.clearInputError('sec-current-password');
          }

          if (nw.value.length < 8) {
            self.setInputError('sec-new-password', 'New password must contain at least 8 characters.');
            valid = false;
          } else {
            self.clearInputError('sec-new-password');
          }

          if (nw.value !== conf.value) {
            self.setInputError('sec-confirm-password', 'Passwords do not match.');
            valid = false;
          } else {
            self.clearInputError('sec-confirm-password');
          }

          if (valid) {
            const submitBtn = this.querySelector('button[type="submit"]');
            self.setButtonLoading(submitBtn, true, 'Updating...');
            setTimeout(() => {
              self.setButtonLoading(submitBtn, false);
              curr.value = '';
              nw.value = '';
              conf.value = '';
              self.showToast('Password Updated', 'Security credentials modified successfully.', 'success');
            }, 800);
          }
        });
      }

      const notifSettingsForm = document.getElementById('form-settings-notifications');
      if (notifSettingsForm) {
        notifSettingsForm.addEventListener('submit', function(e) {
          e.preventDefault();
          self.showToast('Preferences Saved', 'Notification config states updated.', 'success');
        });
      }

      // Settings disconnect button handler
      document.getElementById('btn-settings-disconnect')?.addEventListener('click', function() {
        self.triggerDisconnectConfirmation();
      });

      // Settings sync/refresh handler
      document.getElementById('btn-settings-sync')?.addEventListener('click', function() {
        self.triggerSyncLogs();
      });

      // Dashboard quick actions
      document.getElementById('btn-sync-waba')?.addEventListener('click', function() {
        self.triggerSyncLogs();
      });
      document.getElementById('btn-test-message')?.addEventListener('click', function() {
        self.triggerTestMessage();
      });
      document.getElementById('btn-disconnect-waba')?.addEventListener('click', function() {
        self.triggerDisconnectConfirmation();
      });

      // --- SUPPORT TICKET CREATION LOGIC ---
      document.getElementById('faq-search')?.addEventListener('input', () => this.renderSupport());

      const ticketForm = document.getElementById('form-support-ticket');
      if (ticketForm) {
        const phoneInput = document.getElementById('ticket-phone');
        const descInput = document.getElementById('ticket-desc');

        phoneInput.addEventListener('blur', () => this.validateRequired('ticket-phone', 'Phone number is required.'));
        descInput.addEventListener('blur', () => this.validateRequired('ticket-desc', 'Ticket description cannot be blank.'));

        ticketForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Guard ticket submission if not authenticated
          if (!self.state.authenticated) {
            self.showToast('Sign In Required', 'Please log in to submit support tickets.', 'warning');
            return;
          }

          const isPhone = self.validateRequired('ticket-phone', 'Phone number is required.');
          const isDesc = self.validateRequired('ticket-desc', 'Ticket description cannot be blank.');

          if (isPhone && isDesc) {
            const submitBtn = this.querySelector('button[type="submit"]');
            self.setButtonLoading(submitBtn, true, 'Submitting Request...');
            
            setTimeout(() => {
              self.setButtonLoading(submitBtn, false);
              
              // Generate mock ticket number
              const ticketNum = Math.floor(1000 + Math.random() * 9000);
              
              // Show success view
              document.getElementById('card-support-ticket-form').style.display = 'none';
              const successCard = document.getElementById('card-support-ticket-success');
              successCard.style.display = 'block';
              document.getElementById('ticket-success-number').textContent = `Ticket #BEE-${ticketNum} Created`;
              
              // Add record to log list
              self.state.logs.unshift({
                id: Date.now(),
                type: 'SUCCESS',
                title: `Support Ticket BEE-${ticketNum} Created`,
                desc: 'onboarding verification request logged with support team.',
                time: 'Just now'
              });
              self.persistSession();
              
              self.showToast('Support Request Logged', `Ticket #BEE-${ticketNum} created successfully.`, 'success');
              
              // Reset values
              phoneInput.value = '';
              descInput.value = '';
            }, 1000);
          }
        });
      }

      // New support ticket toggle
      document.getElementById('btn-support-new-ticket')?.addEventListener('click', function() {
        document.getElementById('card-support-ticket-success').style.display = 'none';
        document.getElementById('card-support-ticket-form').style.display = 'block';
      });

      // --- INACTIVITY WARNING MODAL TRIGGERS ---
      document.getElementById('btn-inactivity-logout')?.addEventListener('click', function() {
        self.closeModal('inactivity-modal');
        self.handleLogout();
      });

      document.getElementById('btn-inactivity-extend')?.addEventListener('click', function() {
        self.closeModal('inactivity-modal');
        self.startInactivityTracker();
        self.showToast('Session Extended', 'Inactivity session reset successfully.', 'success');
      });

      // --- META CONNECT EMBEDDED SDK HANDLER ---
      document.getElementById('btn-trigger-meta-signup')?.addEventListener('click', function() {
        self.launchMetaEmbeddedSignup();
      });

      document.getElementById('btn-meta-close')?.addEventListener('click', () => this.closeMetaModal(false));
      document.getElementById('btn-meta-cancel')?.addEventListener('click', () => this.closeMetaModal(false));
      
      document.getElementById('btn-meta-approve')?.addEventListener('click', function() {
        const wabaSelect = document.getElementById('meta-waba-select');
        const phoneSelect = document.getElementById('meta-phone-select');
        const perm1 = document.getElementById('meta-perm-1');
        const perm2 = document.getElementById('meta-perm-2');
        const errPanel = document.getElementById('meta-popup-error');

        // Reset error
        errPanel.style.display = 'none';

        if (!wabaSelect.value || !phoneSelect.value) {
          errPanel.textContent = 'Account profile selection error. Please choose options to proceed.';
          errPanel.style.display = 'block';
          return;
        }

        if (!perm1.checked || !perm2.checked) {
          errPanel.textContent = 'Permissions deselect check. Please authorize all permissions to complete setup.';
          errPanel.style.display = 'block';
          
          // Log Permission Denied Attempt
          self.state.logs.unshift({
            id: Date.now(),
            type: 'ERROR',
            title: 'Meta Handshake Permissions Denied',
            desc: 'Authorized scopes were unchecked or missing during consent.',
            time: 'Just now'
          });
          self.persistSession();
          return;
        }

        // Complete connection handshake simulation
        self.closeMetaModal(true, {
          wabaName: wabaSelect.value,
          phoneNumber: phoneSelect.value
        });
      });
    },

    // ==========================================================================
    // 6. FORM FIELD REAL-TIME VALIDATORS
    // ==========================================================================
    validateRequired: function(fieldId, errorMsg) {
      const input = document.getElementById(fieldId);
      if (!input) return false;
      
      if (!input.value.trim()) {
        this.setInputError(fieldId, errorMsg);
        return false;
      }
      this.clearInputError(fieldId);
      return true;
    },

    validateEmail: function(fieldId) {
      const input = document.getElementById(fieldId);
      if (!input) return false;
      
      const emailVal = input.value.trim();
      if (!emailVal) {
        this.setInputError(fieldId, 'Email address is required.');
        return false;
      }

      // Standard simple RFC email matching regex
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(emailVal)) {
        this.setInputError(fieldId, 'Please enter a valid business email address.');
        return false;
      }
      this.clearInputError(fieldId);
      return true;
    },

    checkPasswordStrength: function(val) {
      if (val.length < 8) return 'WEAK';
      
      // Numbers, special char checks
      const hasNumber = /\d/.test(val);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

      if (hasNumber && hasSpecial) return 'STRONG';
      return 'MEDIUM';
    },

    validatePasswordStrength: function() {
      const input = document.getElementById('signup-password');
      if (!input) return false;

      if (!input.value) {
        this.setInputError('signup-password', 'Password is required.');
        return false;
      }

      const strength = this.checkPasswordStrength(input.value);
      if (strength === 'WEAK') {
        this.setInputError('signup-password', 'Password is too weak. Must contain at least 8 characters.');
        return false;
      }
      this.clearInputError('signup-password');
      return true;
    },

    validateConfirmPassword: function() {
      const pass = document.getElementById('signup-password');
      const confirm = document.getElementById('signup-confirm-password');
      if (!pass || !confirm) return false;

      if (!confirm.value) {
        this.setInputError('signup-confirm-password', 'Confirm password is required.');
        return false;
      }

      if (pass.value !== confirm.value) {
        this.setInputError('signup-confirm-password', 'Passwords do not match.');
        return false;
      }
      this.clearInputError('signup-confirm-password');
      return true;
    },

    validateCheckbox: function(fieldId, errorMsg) {
      const checkbox = document.getElementById(fieldId);
      if (!checkbox) return false;

      if (!checkbox.checked) {
        this.setInputError(fieldId, errorMsg);
        return false;
      }
      this.clearInputError(fieldId);
      return true;
    },

    validateCheckboxValue: function(fieldId) {
      const checkbox = document.getElementById(fieldId);
      return checkbox ? checkbox.checked : false;
    },

    setInputError: function(fieldId, errorMsg) {
      const input = document.getElementById(fieldId);
      const errLabel = document.getElementById(`${fieldId}-error`);
      if (input) input.classList.add('form-input-error');
      if (errLabel) {
        errLabel.textContent = errorMsg;
        errLabel.style.display = 'flex';
      }
    },

    clearInputError: function(fieldId) {
      const input = document.getElementById(fieldId);
      const errLabel = document.getElementById(`${fieldId}-error`);
      if (input) input.classList.remove('form-input-error');
      if (errLabel) {
        errLabel.textContent = '';
        errLabel.style.display = 'none';
      }
    },

    setButtonLoading: function(btnElement, isLoading, loadingText = 'Processing...') {
      if (!btnElement) return;

      if (isLoading) {
        btnElement.setAttribute('disabled', 'true');
        btnElement.dataset.originalText = btnElement.innerHTML;
        btnElement.innerHTML = `<span class="btn-loading-spinner"></span> <span>${loadingText}</span>`;
      } else {
        btnElement.removeAttribute('disabled');
        if (btnElement.dataset.originalText) {
          btnElement.innerHTML = btnElement.dataset.originalText;
        }
      }
    },

    // ==========================================================================
    // 7. TOAST NOTIFICATION SYSTEM
    // ==========================================================================
    showToast: function(title, description, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      // Create toast element
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
      
      let iconSvg = '';
      if (type === 'success') {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-top: 2px;"><path d="M20 6L9 17L4 12" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      } else if (type === 'error') {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-top: 2px;"><circle cx="12" cy="12" r="10" stroke="var(--error)" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="var(--error)" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="var(--error)"/></svg>`;
      } else if (type === 'warning') {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-top: 2px;"><circle cx="12" cy="12" r="10" stroke="var(--warning)" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="var(--warning)" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="var(--warning)"/></svg>`;
      } else {
        // Info uses terracotta accent color icon
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-top: 2px;"><circle cx="12" cy="12" r="10" stroke="var(--brand-accent)" stroke-width="2"/><line x1="12" y1="16" x2="12" y2="12" stroke="var(--brand-accent)" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="1" fill="var(--brand-accent)"/></svg>`;
      }

      toast.innerHTML = `
        ${iconSvg}
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-desc">${description}</div>
        </div>
        <button class="toast-close" aria-label="Dismiss message">×</button>
      `;

      container.appendChild(toast);
      
      // Trigger CSS transition
      setTimeout(() => toast.classList.add('show'), 50);

      // Close handler
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => {
        this.dismissToast(toast);
      });

      // Auto dismiss
      if (type !== 'error') {
        const duration = type === 'warning' ? 6000 : (type === 'success' ? 3500 : 4000);
        setTimeout(() => {
          this.dismissToast(toast);
        }, duration);
      }
    },

    dismissToast: function(toast) {
      if (!toast.parentNode) return;
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300); // match transition speed
    },

    // ==========================================================================
    // 8. SECURITY & SESSION TIMEOUT ENGINE
    // ==========================================================================
    startInactivityTracker: function() {
      this.stopInactivityTracker();
      
      // Listeners to reset inactivity timer
      const reset = () => this.resetInactivityTimer();
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(e => {
        document.addEventListener(e, reset, { passive: true });
      });

      this.resetInactivityTimer();
    },

    stopInactivityTracker: function() {
      if (this.state.idleTimer) clearTimeout(this.state.idleTimer);
      if (this.state.countdownTimer) clearInterval(this.state.countdownTimer);
      
      // Remove reset listeners
      const reset = () => this.resetInactivityTimer();
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(e => {
        document.removeEventListener(e, reset);
      });
    },

    resetInactivityTimer: function() {
      if (this.state.idleTimer) clearTimeout(this.state.idleTimer);
      
      // Inactivity timeout warning is set to 28 minutes in PRD.
      // For local demo evaluation, we will run the check on a scaled model:
      // 3 minutes (180,000ms) warning warning trigger.
      const TIMEOUT_WARNING_MS = 180000; 

      this.state.idleTimer = setTimeout(() => {
        this.triggerInactivityWarning();
      }, TIMEOUT_WARNING_MS);
    },

    triggerInactivityWarning: function() {
      // Display warning modal
      this.openModal('inactivity-modal');
      
      // Start 120s count countdown
      this.state.countdownValue = 120;
      const display = document.getElementById('inactivity-countdown');
      if (display) display.textContent = this.state.countdownValue;

      if (this.state.countdownTimer) clearInterval(this.state.countdownTimer);
      this.state.countdownTimer = setInterval(() => {
        this.state.countdownValue--;
        if (display) display.textContent = this.state.countdownValue;

        if (this.state.countdownValue <= 0) {
          clearInterval(this.state.countdownTimer);
          this.closeModal('inactivity-modal');
          
          // Log Expired session trigger
          this.handleLogout(false, 'SESSION_EXPIRED');
        }
      }, 1000);
    },

    handleLogout: function(isSilent = false, reason = 'LOGOUT') {
      // Reset authenticated states
      this.state.authenticated = false;
      this.state.user = null;
      this.state.connection = { isConnected: false, wabaName: '', phoneNumber: '', connectedAt: '', lastSync: null, status: 'Inactive' };
      
      this.persistSession();
      this.updateNavbar();
      this.stopInactivityTracker();

      if (!isSilent) {
        // Broadcast logout to other tabs
        this.state.authChannel?.postMessage('LOGOUT');
      }

      if (reason === 'SESSION_EXPIRED') {
        this.showToast('Session Expired', 'Security session locked due to inactivity. Please sign in again.', 'warning');
      } else {
        this.showToast('Logged Out', 'You have been securely signed out.', 'info');
      }

      window.location.hash = '#/login';
    },

    // Modal Control wrappers
    openModal: function(modalId) {
      const overlay = document.getElementById(modalId);
      if (overlay) overlay.classList.add('active');
    },

    closeModal: function(modalId) {
      const overlay = document.getElementById(modalId);
      if (overlay) overlay.classList.remove('active');
    },

    // ==========================================================================
    // 9. SIMULATED META INTEGRATION ENGINE
    // ==========================================================================
    launchMetaEmbeddedSignup: function() {
      // Show loading text on triggers
      const launchBtn = document.getElementById('btn-trigger-meta-signup');
      this.setButtonLoading(launchBtn, true, 'Launching Meta SDK...');

      setTimeout(() => {
        this.setButtonLoading(launchBtn, false);
        
        // Open simulated Meta modal popup dialog
        // Load default logged in info matching signup details if available
        if (this.state.user) {
          const profileInitial = document.getElementById('meta-profile-initial');
          const profileName = document.getElementById('meta-profile-name');
          const profileEmail = document.getElementById('meta-profile-email');

          if (profileInitial) profileInitial.textContent = this.state.user.name[0];
          if (profileName) profileName.textContent = this.state.user.name;
          if (profileEmail) profileEmail.textContent = this.state.user.email;
        }

        this.openModal('meta-signup-modal');
      }, 500);
    },

    closeMetaModal: function(isApproved = false, configData = null) {
      this.closeModal('meta-signup-modal');

      if (isApproved && configData) {
        // Connection Handshake approved successfully
        const syncDate = new Date();
        const dateStr = syncDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        this.setState('connection', {
          isConnected: true,
          wabaName: configData.wabaName,
          phoneNumber: configData.phoneNumber,
          connectedAt: dateStr,
          lastSync: syncDate.toLocaleTimeString(),
          status: 'Active'
        });

        // Insert new records to log feed
        this.state.logs.unshift(
          { id: Date.now() + 1, type: 'SUCCESS', title: 'WhatsApp Business Link Active', desc: `Number ${configData.phoneNumber} linked successfully to business profile "${configData.wabaName}".`, time: 'Just now' },
          { id: Date.now(), type: 'SUCCESS', title: 'Meta Handshake Complete', desc: 'Secure connection keys verified and approved.', time: 'Just now' }
        );
        this.persistSession();

        this.showToast('WhatsApp Account Linked', 'Your business connection has been authorized by Meta.', 'success');
        window.location.hash = '#/success';
      } else {
        // Cancelled / Dismissed
        this.showToast('Connection Cancelled', 'Meta Embedded Signup setup was closed by user.', 'warning');
      }
    },

    // --- CONNECTION DIAGNOSTIC / QUICK CONTROLS ACTIONS ---
    triggerSyncLogs: function() {
      this.showToast('Refreshing Connection Logs', 'Requesting status audits from Meta Business channels...', 'info');
      
      const syncBtn = document.getElementById('btn-sync-waba');
      const syncBtnSet = document.getElementById('btn-settings-sync');
      
      if (syncBtn) this.setButtonLoading(syncBtn, true, 'Syncing...');
      if (syncBtnSet) this.setButtonLoading(syncBtnSet, true, 'Syncing...');

      setTimeout(() => {
        if (syncBtn) this.setButtonLoading(syncBtn, false);
        if (syncBtnSet) this.setButtonLoading(syncBtnSet, false);

        // Update last sync state
        const now = new Date();
        const newConnection = Object.assign({}, this.state.connection, { lastSync: now.toLocaleTimeString() });
        this.setState('connection', newConnection);

        // Add Log entry
        this.state.logs.unshift({
          id: Date.now(),
          type: 'SUCCESS',
          title: 'WABA Security Scopes Synced',
          desc: 'Manual sync complete. Verified optimal status on connection.',
          time: 'Just now'
        });
        this.persistSession();
        this.renderDashboard();

        this.showToast('Handshake Synced', 'All permissions are optimal.', 'success');
      }, 1200);
    },

    triggerTestMessage: function() {
      this.showToast('Preparing Test Alert', 'Sending template SMS validation message...', 'info');
      
      const testBtn = document.getElementById('btn-test-message');
      if (testBtn) this.setButtonLoading(testBtn, true, 'Sending...');

      setTimeout(() => {
        if (testBtn) this.setButtonLoading(testBtn, false);

        this.state.logs.unshift({
          id: Date.now(),
          type: 'SUCCESS',
          title: 'Test Notification Delivered',
          desc: `Sent test message template via gateway to phone number: ${this.state.connection.phoneNumber}.`,
          time: 'Just now'
        });
        this.persistSession();
        this.renderDashboard();

        this.showToast('Delivered Successfully', 'Check your linked WhatsApp device for the confirmation template.', 'success');
      }, 1000);
    },

    triggerDisconnectConfirmation: function() {
      const confirm = window.confirm("Warning: Disconnecting will stop all data synchronization and communication services linked to this number. Are you sure you want to proceed?");
      if (confirm) {
        // Disconnect
        this.setState('connection', { isConnected: false, wabaName: '', phoneNumber: '', connectedAt: '', lastSync: null, status: 'Inactive' });
        
        // Add log entry
        this.state.logs.unshift({
          id: Date.now(),
          type: 'WARNING',
          title: 'WhatsApp Connection Removed',
          desc: 'Account link keys deleted from local verification logs.',
          time: 'Just now'
        });
        this.persistSession();
        
        this.showToast('Account Disconnected', 'Your WhatsApp number connection has been deleted.', 'info');
        window.location.hash = '#/dashboard';
      }
    },

    // ==========================================================================
    // 10. LANGUAGE GOVERNANCE DICTIONARY SCANNER
    // ==========================================================================
    languageGovernanceCheck: function() {
      const forbidden = ["API", "OAuth", "Webhook", "Token", "WABA", "Phone Number ID", "Client Secret", "Embedded Signup", "Access Token"];
      const approved = {
        "API": "Connection Services",
        "OAuth": "Meta Secure Login",
        "Webhook": "Data Synchronization",
        "Token": "Authorization Key",
        "WABA": "WhatsApp Business Profile",
        "Phone Number ID": "WhatsApp Business Number",
        "Client Secret": "Verification Code",
        "Embedded Signup": "Meta Connection Flow",
        "Access Token": "Security Permission Key"
      };

      // Perform text scan on DOM elements that don't belong to scripts/styles
      const self = this;
      
      function walkDOM(node) {
        // If text node
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.nodeValue;
          let changed = false;

          forbidden.forEach(word => {
            // Match word exactly as complete substring to avoid replacing inner parts of approved terms
            const regex = new RegExp(`\\b${word}\\b`, 'g');
            if (regex.test(text)) {
              text = text.replace(regex, approved[word]);
              changed = true;
            }
          });

          if (changed) {
            node.nodeValue = text;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip meta/script/style/link/select/input tags
          const tag = node.tagName.toLowerCase();
          if (tag !== 'script' && tag !== 'style' && tag !== 'link' && tag !== 'select' && tag !== 'option' && tag !== 'input' && tag !== 'textarea') {
            for (let i = 0; i < node.childNodes.length; i++) {
              walkDOM(node.childNodes[i]);
            }
          }
        }
      }

      walkDOM(document.body);
    }

  };

  // Instantiate application
  window.BEE = BEE;
  document.addEventListener('DOMContentLoaded', function() {
    BEE.init();
  });

})();
