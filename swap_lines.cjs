const fs = require('fs');
const path = 'c:/Users/vivekvkraj/OneDrive/Desktop/Cab booking/Carbookig_Website/Cab_Booking_Website/src/pages/BulkBooking.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Find start and end of Car Selection (Step 1)
const carStart = lines.findIndex(l => l.includes('{/* Step 1: Car Selection */}'));
const tripStart = lines.findIndex(l => l.includes('{/* Step 2: Trip Details */}'));
const tripEnd = lines.findIndex(l => l.includes('{/* Right Column: Checkout Summary */}')) - 2;

if (carStart !== -1 && tripStart !== -1 && tripEnd !== -1) {
    let carBlock = lines.slice(carStart, tripStart);
    let tripBlock = lines.slice(tripStart, tripEnd);

    // Swap numbering in Car Block
    carBlock = carBlock.map(l => l.replace('step === 1', 'step === 2')
                                  .replace('Step 1: Car Selection', 'Step 2: Car Selection')
                                  .replace('>1</div>', '>2</div>'));
    
    // Swap numbering in Trip Block
    tripBlock = tripBlock.map(l => l.replace('step === 2', 'step === 1')
                                    .replace('Step 2: Trip Details', 'Step 1: Trip Details'));

    // Fix the badge in Trip Details
    const headerIdx = tripBlock.findIndex(l => l.includes('<h3 className="text-xl font-bold text-white">Journey Details</h3>'));
    if (headerIdx !== -1) {
        tripBlock.splice(headerIdx, 0, '                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold text-sm shrink-0">1</div>');
    }

    const newLines = [
        ...lines.slice(0, carStart),
        ...tripBlock,
        ...carBlock,
        ...lines.slice(tripEnd)
    ];

    fs.writeFileSync(path, newLines.join('\n'));
    console.log("Successfully swapped lines");
} else {
    console.log("Could not find line indices", {carStart, tripStart, tripEnd});
}
