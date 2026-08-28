/**
 * Centralized course catalog with pricing.
 * Update prices here — they propagate to Certifications, Cart, and Checkout.
 */

export const COURSES = [
  {
    id: 'intro-os',
    name: 'Introduction To Operating System',
    description: 'Foundations of OS concepts and architecture — file systems, process management, memory allocation, and kernel fundamentals.',
    price: 1100,
    originalPrice: 1100,
    duration: '4 Weeks',
    level: 'Beginner',
    modules: 12,
    provider: 'Spyrewall',
    icon: 'Monitor',
    soldOut: true,
  },
  {
    id: 'cyber-fundamentals',
    name: 'Basic Fundamentals of Cyber Security',
    description: 'Beginner friendly for people who want to start their journey in cyber security. Covers CIA triad, network security, and threat landscapes.',
    price: 1100,
    originalPrice: 1100,
    duration: '3 Weeks',
    level: 'Beginner',
    modules: 10,
    provider: 'Spyrewall',
    icon: 'Shield',
    soldOut: false,
  },
  {
    id: 'programming-langs',
    name: 'Programming Languages',
    description: 'Learn essential programming languages used in cybersecurity and ethical hacking — Python, Bash, and C for exploit development.',
    price: 1100,
    originalPrice: 1100,
    duration: '6 Weeks',
    level: 'Intermediate',
    modules: 18,
    provider: 'Spyrewall',
    icon: 'Code',
    soldOut: true,
  },
  {
    id: 'soc-analyst',
    name: 'SOC Analyst',
    description: 'Security Operations Center analyst skills — threat monitoring, SIEM tools, incident response, and log analysis.',
    price: 2100,
    originalPrice: 2100,
    duration: '8 Weeks',
    level: 'Intermediate',
    modules: 22,
    provider: 'Spyrewall',
    icon: 'Eye',
    soldOut: true,
  },
  {
    id: 'penetration-testing',
    name: 'Penetration Testing',
    description: 'Ethical hacking and penetration testing methodologies for real-world assessments — recon, exploitation, post-exploitation, and reporting.',
    price: 2100,
    originalPrice: 2100,
    duration: '10 Weeks',
    level: 'Advanced',
    modules: 28,
    provider: 'Spyrewall',
    icon: 'Crosshair',
    soldOut: true,
  },
]

/**
 * Find a course by its ID.
 */
export function getCourseById(id) {
  return COURSES.find(c => c.id === id) || null
}

/**
 * Format price in INR with ₹ symbol and commas.
 */
export function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN')
}
