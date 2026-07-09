import fs from 'node:fs';
import path from 'node:path';

const builders = [
  { name: 'lodha', url: 'https://logo.clearbit.com/lodhagroup.in' },
  { name: 'godrej', url: 'https://logo.clearbit.com/godrejproperties.com' },
  { name: 'dlf', url: 'https://logo.clearbit.com/dlf.in' },
  { name: 'piramal', url: 'https://logo.clearbit.com/piramalrealty.com' },
  { name: 'prestige', url: 'https://logo.clearbit.com/prestigeconstructions.com' },
  { name: 'tata', url: 'https://logo.clearbit.com/tatahousing.com' },
  { name: 'shapoorji', url: 'https://logo.clearbit.com/shapoorjipallonji.com' },
  { name: 'raheja', url: 'https://logo.clearbit.com/raheja.com' },
  { name: 'brigade', url: 'https://logo.clearbit.com/brigadegroup.com' },
  { name: 'mahindra', url: 'https://logo.clearbit.com/mahindralifespaces.com' }
];

async function download() {
  const dir = './public/builders';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  for (const b of builders) {
    try {
      const res = await fetch(b.url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(path.join(dir, `${b.name}.png`), Buffer.from(buffer));
        console.log(`Downloaded ${b.name}.png`);
      } else {
        console.error(`Failed to download ${b.name}: ${res.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${b.name}:`, e);
    }
  }
}

download();
