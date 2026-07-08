const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// 1. Convert specific sections from <TerminalSection> to <section>
const sectionsToDemote = [
  { id: 'skills', title: '// 02. TECHNICAL_ARSENAL' },
  { id: 'services', title: '// 03. CORE_COMPETENCIES' },
  { id: 'projects', title: '// 04. SELECTED_WORKS' },
  { id: 'blog', title: '// 05. TECHNICAL_ARTICLES' },
  { id: 'testimonials', title: '// 06. TESTIMONIALS' },
  { id: 'contact', title: '// 07. HANDSHAKE_PROTOCOL' },
];

sectionsToDemote.forEach(sec => {
  // Find the exact TerminalSection start tag for this id
  const regexStart = new RegExp(`<TerminalSection id="${sec.id}" command="[^"]+">`);
  
  // Replace it with the lightweight section and the title
  content = content.replace(regexStart, `<section id="${sec.id}" className="border-l-2 border-terminal-green/20 pl-4 space-y-6 md:pl-6 relative before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-terminal-bg before:border-2 before:border-terminal-green/40 before:rounded-full">`);
});

// Since each section is replaced, we need to match the closing </TerminalSection> tags for them.
// Wait, doing this via string replacement of </TerminalSection> is risky because of nested tags or hero/about.
// Actually, hero is <TerminalSection command="visitor@mokua-host: ~/sys/boot">
// about is <TerminalSection id="about" ...>
// All other </TerminalSection> should become </section>.
// Let's count them. There are 8 TerminalSections total in Home.jsx.
// 2 stay (hero, about), 6 become <section>.
// Since we only replaced 6 opening tags, the JSX will be broken. We must replace the exactly corresponding closing tags.
// Let's use a simpler approach: 
// The file has these exact strings for opening tags.
const regexHeroEnd = /<\/TerminalSection>(\s*\{\/\* ABOUT SECTION)/;
const regexAboutEnd = /<\/TerminalSection>(\s*\{\/\* SKILLS SECTION)/;
// Wait, if I move Projects below About, the order changes!
// Let's first extract the Projects section block.

const projectStartRegex = /\{\/\* PROJECTS SECTION \*\/\}/;
const projectMatch = content.match(projectStartRegex);

const projectEndRegex = /\{\/\* ARTICLES SECTION \*\/\}/;
const articleMatch = content.match(projectEndRegex);

if (projectMatch && articleMatch) {
  const projectsBlock = content.substring(projectMatch.index, articleMatch.index);
  
  // Remove projects from old location
  content = content.substring(0, projectMatch.index) + content.substring(articleMatch.index);
  
  // Insert below About section
  // About section ends at `          </TerminalSection>\n\n          {/* SKILLS SECTION */}`
  const aboutEndRegex = /<\/TerminalSection>\s*\{\/\* SKILLS SECTION \*\/\}/;
  const aboutEndMatch = content.match(aboutEndRegex);
  
  if (aboutEndMatch) {
     const insertIndex = aboutEndMatch.index + '</TerminalSection>'.length;
     content = content.substring(0, insertIndex) + '\n\n          ' + projectsBlock.trim() + '\n\n          ' + content.substring(insertIndex);
  }
}

// Now replace opening TerminalSection tags for the light ones.
content = content.replace(/<TerminalSection id="skills" command="[^"]+">/, `<section id="skills" className="border-l-2 border-terminal-green/30 pl-4 space-y-6">`);
content = content.replace(/<TerminalSection id="services" command="[^"]+">/, `<section id="services" className="border-l-2 border-terminal-green/30 pl-4 space-y-6">`);
content = content.replace(/<TerminalSection id="projects" command="[^"]+">/, `<section id="projects" className="border-l-2 border-terminal-green/30 pl-4 space-y-6">`);
content = content.replace(/<TerminalSection id="blog" command="[^"]+">/, `<section id="blog" className="border-l-2 border-terminal-green/30 pl-4 space-y-6">`);
content = content.replace(/<TerminalSection id="testimonials" command="[^"]+">/, `<section id="testimonials" className="border-l-2 border-terminal-green/30 pl-4 space-y-6">`);
content = content.replace(/<TerminalSection id="contact" command="[^"]+">/, `<section id="contact" className="border-l-2 border-terminal-green/30 pl-4 space-y-6">`);

// Since only Hero and About still have <TerminalSection, there will be exactly 2 valid pairs of <TerminalSection> and </TerminalSection> if we replace the other 6.
// To reliably replace the closing tags, we can just replace ALL `</TerminalSection>` with `</section>`, EXCEPT the first two!
let parts = content.split('</TerminalSection>');
if (parts.length === 9) { // 8 tags -> 9 parts
   // Keep parts 0, 1, 2 joined by </TerminalSection>
   const heroAndAboutAndProj = parts[0] + '</TerminalSection>' + parts[1] + '</TerminalSection>';
   // The rest joined by </section>
   const rest = parts.slice(2).join('</section>');
   content = heroAndAboutAndProj + rest;
} else {
   console.log("Error: expected 8 TerminalSection closing tags, found " + (parts.length - 1));
}

// Write it out
fs.writeFileSync('src/pages/Home.jsx', content);
console.log("Success");

