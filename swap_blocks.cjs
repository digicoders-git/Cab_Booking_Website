const fs = require('fs');
const filePath = 'c:/Users/vivekvkraj/OneDrive/Desktop/Cab booking/Carbookig_Website/Cab_Booking_Website/src/pages/BulkBooking.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Extract the two blocks
const block1Regex = /(\s*\{\/\* Step 1: Car Selection \*\/\}\s*<div className=\{`bg-\[#0A0A0A\].*?step === 1.*?\n[\s\S]*?\s*\}\)\}\s*<\/div>\s*<\/div>\s*)/;
const block2Regex = /(\s*\{\/\* Step 2: Trip Details \*\/\}\s*<div className=\{`bg-\[#0A0A0A\].*?step === 2.*?\n[\s\S]*?Auto-calculated using Google Maps<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*)/;

const match1 = content.match(block1Regex);
const match2 = content.match(block2Regex);

if (match1 && match2) {
    let block1 = match1[0];
    let block2 = match2[0];

    // Modify step variables and numbers
    block1 = block1.replace('step === 1', 'step === 2')
                   .replace('Step 1: Car Selection', 'Step 2: Car Selection')
                   .replace('>1</div>', '>2</div>');
                   
    block2 = block2.replace('step === 2', 'step === 1')
                   .replace('Step 2: Trip Details', 'Step 1: Trip Details')
                   .replace('<h3 className="text-xl font-bold text-white">Journey Details</h3>', '<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold text-sm shrink-0">1</div>\n                <h3 className="text-xl font-bold text-white">Journey Details</h3>');

    // Replace the combined section
    const fullMatchRegex = new RegExp(match1[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + match2[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    content = content.replace(fullMatchRegex, block2 + block1);
    
    fs.writeFileSync(filePath, content);
    console.log('Successfully swapped blocks');
} else {
    console.log('Could not find blocks');
}
