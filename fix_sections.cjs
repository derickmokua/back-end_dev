const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// ----- 1. REORDER: Move Skills before Projects -----
// Current order after About: Projects → Skills → Services → Blog → Testimonials → Contact
// Target order:              Skills → Projects → Services → Blog → Testimonials → Contact

const PROJ_COMMENT = '{/* PROJECTS SECTION */}';
const SKILLS_COMMENT = '{/* SKILLS SECTION */}';
const SERV_COMMENT = '{/* SERVICES SECTION */}';

const projStart = content.indexOf(PROJ_COMMENT);
const skillsStart = content.indexOf(SKILLS_COMMENT);
const servStart = content.indexOf(SERV_COMMENT);

// Extract Projects block (from PROJECTS comment up to (but not including) blank lines before SKILLS)
const projectsBlock = content.substring(projStart, skillsStart).trimEnd();
// Extract Skills block  (from SKILLS comment up to (but not including) SERVICES)
const skillsBlock   = content.substring(skillsStart, servStart).trimEnd();

// Build new middle section: Skills first, then Projects
const newMiddle = skillsBlock + '\n\n          ' + projectsBlock;

// Replace old middle (Projects + Skills) with newMiddle
content = content.substring(0, projStart) + newMiddle + '\n\n          ' + content.substring(servStart);

// ----- 2. FIX SECTION HEADERS -----
// Standardise all section headings to the numbered // NN. LABEL format
const headerFixes = [
  // About
  [
    `<h2 className="text-[10px] font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">\n              <span className="w-1 h-4 bg-terminal-green/60 rounded-full inline-block" />\n              About\n            </h2>`,
    `<h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">\n              // 01. ABOUT\n            </h2>`
  ],
  // Skills (02)
  [`// 02. TECHNICAL_ARSENAL`, `// 02. TECHNICAL_ARSENAL`],
  // Projects (03)
  [`// 04. SELECTED_WORKS`, `// 03. SELECTED_WORKS`],
  // Services (04) - currently has inline-block span style
  [
    `<h2 className="text-[10px] font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">\n                <span className="w-1 h-4 bg-terminal-green/60 rounded-full inline-block" />\n                Services\n              </h2>`,
    `<h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">\n                // 04. SERVICES\n              </h2>`
  ],
  // Articles (05)
  [`// 05. TECHNICAL_ARTICLES`, `// 05. ARTICLES`],
  // Testimonials (06) - already correct number, just check
  [`// 06. TESTIMONIALS`, `// 06. TESTIMONIALS`],
  // Contact (07)
  [`// 07. HANDSHAKE_PROTOCOL`, `// 07. CONTACT`],
];

for (const [from, to] of headerFixes) {
  if (from !== to) {
    content = content.split(from).join(to);
  }
}

// ----- 3. Fix About section header to match section style -----
// The about section was converted from TerminalSection, and its heading is different.
// Normalise it:
content = content.replace(
  `<h2 className="text-[10px] font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-terminal-green/60 rounded-full inline-block" />
              About
            </h2>`,
  `<h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 01. ABOUT
            </h2>`
);

fs.writeFileSync('src/pages/Home.jsx', content);
console.log('Done. Section order fixed and headers updated.');
