// =============================================================================
//  CURATED POSTINGS — Spyrewall
// =============================================================================
//  This file is the SINGLE SOURCE OF TRUTH for what shows on the public
//  Internship and Jobs tabs at /careers.
//
//  HOW TO ADD A NEW POSTING:
//  1. Recruiter submits the form -> you receive an email at
//     Spyrewall@gmail.com with all the details.
//  2. Copy the details into a new object below using the template, paste it
//     at the top of the relevant array, and save.
//  3. Commit & redeploy — the posting now appears for all visitors.
//
//  HOW TO REMOVE / EXPIRE A POSTING:
//  Just delete its object from the array (or move it to ARCHIVED at bottom).
//
//  REQUIRED FIELDS: id (unique), type, role, company, location, vacancies,
//                   paid (true/false), aboutJob, requirements, aboutCompany,
//                   email, postedAt (ISO date)
//  OPTIONAL: amountPerMonth (only if paid), duration (internship only),
//            experienceType + minExperience (job only), additionalInfo,
//            recruiterName, phone
// =============================================================================

export const CURATED_POSTINGS = [
  // ------- TEMPLATE — copy & uncomment to add a new posting -------
  // {
  //   id: 'unique-slug-2026-01',
  //   type: 'internship',                  // 'internship' or 'job'
  //   role: 'Penetration Tester Intern',
  //   company: 'Acme Security Pvt Ltd',
  //   location: 'Remote / Bangalore',
  //   vacancies: '2',
  //   paid: true,
  //   amountPerMonth: '₹15,000',           // omit / '' if unpaid
  //   duration: '3 months',                // internship only
  //   // For jobs instead of duration use:
  //   // experienceType: 'experienced',    // 'freshers' or 'experienced'
  //   // minExperience: '2',               // years (only if experienced)
  //   aboutJob: 'Hands-on web app & network pentesting under senior mentorship.',
  //   requirements: 'Basic knowledge of OWASP Top 10, Burp Suite, Linux CLI.',
  //   aboutCompany: 'Acme Security is a boutique offensive-security consultancy.',
  //   additionalInfo: '',                  // optional
  //   recruiterName: 'Jane Doe',
  //   email: 'jane@acmesec.com',
  //   phone: '+91 90000 00000',            // optional
  //   postedAt: '2026-04-29T10:00:00.000Z',
  // },
]

// Convenience helpers
export const getCuratedPostings = (type) =>
  CURATED_POSTINGS.filter(p => p.type === type)
