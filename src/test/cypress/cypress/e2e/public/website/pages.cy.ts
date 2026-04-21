describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the hero section with key content', () => {
    cy.contains('Empowering Progress, Together').should('be.visible');
    cy.contains('A collaborative platform for parents and clinicians').should('be.visible');
    cy.contains('Get Started').should('be.visible');
    cy.contains('Learn More').should('be.visible');
  });

  it('renders the services section', () => {
    cy.contains('Our Core Services').should('be.visible');
    cy.contains('Collaborative Care').should('be.visible');
    cy.contains('Track Development').should('be.visible');
    cy.contains('Personalized Insights').should('be.visible');
  });

  it('renders the features section', () => {
    cy.contains('Platform Features').should('be.visible');
    cy.contains('Secure child profiles with detailed notes and history.').should('be.visible');
    cy.contains('Role-based access for parents, clinicians, and admins.').should('be.visible');
  });

  it('renders the FAQ section and can expand an item', () => {
    cy.contains('Frequently Asked Questions').should('be.visible');
    cy.contains("How secure is my child's data?").should('be.visible');

    cy.contains("How secure is my child's data?").click();
    cy.contains('end-to-end encryption').should('be.visible');
  });

  it('renders the testimonials section', () => {
    cy.contains('What People Are Saying').should('be.visible');
  });

  it('renders the lead capture section', () => {
    cy.contains('Ready to Transform Child Development?').should('be.visible');
    cy.contains('Request Early Access').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
  });

  it('renders navigation links to all main public pages', () => {
    cy.get('nav').contains('About').should('be.visible');
    cy.get('nav').contains('Blog').should('be.visible');
    cy.get('nav').contains('Pricing').should('be.visible');
    cy.get('nav').contains('Contact').should('be.visible');
  });

  it('renders Sign Up and Login CTAs', () => {
    cy.contains('Sign Up').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('renders the footer with company links', () => {
    cy.get('footer').contains('About').should('be.visible');
    cy.get('footer').contains('Blog').should('be.visible');
    cy.get('footer').contains('Privacy Policy').should('be.visible');
    cy.get('footer').contains('Terms of Service').should('be.visible');
  });
});

describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/about');
  });

  it('has the correct URL', () => {
    cy.url().should('include', '/about');
  });

  it('renders the page title', () => {
    cy.contains('About Raising Atlantic').should('be.visible');
  });

  it('renders the page intro content', () => {
    cy.contains('our mission is to create a seamless, collaborative environment').should('be.visible');
  });

  it('renders the Clinic Directors section heading', () => {
    cy.contains('Our Clinic Directors').should('be.visible');
    cy.contains('Atlantic Children\'s Practice').should('be.visible');
  });

  it('renders all four clinic directors', () => {
    cy.contains('Dr Raphaella Stander').should('be.visible');
    cy.contains('General Paediatrician').should('be.visible');

    cy.contains('Dr Kate Browde').should('be.visible');
    cy.contains('Paediatrician and Allergist').should('be.visible');

    cy.contains('Megan Smith').should('be.visible');
    cy.contains('Occupational Therapist').should('be.visible');

    cy.contains('Amy Kallenbach').should('be.visible');
    cy.contains('Speech Therapist').should('be.visible');
  });

  it('renders director profile images', () => {
    cy.get('img[alt="Dr Raphaella Stander"]').should('be.visible');
    cy.get('img[alt="Dr Kate Browde"]').should('be.visible');
    cy.get('img[alt="Megan Smith"]').should('be.visible');
    cy.get('img[alt="Amy Kallenbach"]').should('be.visible');
  });

  it('can navigate back to home via the logo', () => {
    cy.get('nav a[href="/"]').first().click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});

describe('Blog Page', () => {
  beforeEach(() => {
    cy.visit('/blog');
  });

  it('has the correct URL', () => {
    cy.url().should('include', '/blog');
  });

  it('renders the blog hero badge', () => {
    cy.contains('Raising Atlantic Blog').should('be.visible');
  });

  it('renders the blog hero heading', () => {
    cy.contains('Insights into the').should('be.visible');
    cy.contains('Future of Pediatrics').should('be.visible');
  });

  it('renders the blog hero subtitle', () => {
    cy.contains('Deep dives into child development').should('be.visible');
  });

  it('renders blog posts or an empty state', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="blog-card"]').length > 0 || $body.text().includes('Read Full Story')) {
        cy.contains('Read Full Story').should('be.visible');
      } else {
        cy.contains('No stories yet.').should('be.visible');
        cy.contains('Check back soon for new insights.').should('be.visible');
      }
    });
  });

  it('renders navigation back to landing from the blog page', () => {
    cy.get('nav').contains('About').should('be.visible');
    cy.get('nav').contains('Login').should('be.visible');
  });

  it('can navigate to the About page from the blog nav', () => {
    cy.get('nav').contains('About').click();
    cy.url().should('include', '/about');
    cy.contains('About Raising Atlantic').should('be.visible');
  });
});
